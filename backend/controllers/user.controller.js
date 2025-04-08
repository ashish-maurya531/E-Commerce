const bcrypt = require("bcryptjs")
const { users } = require("../data/users")
const db = require("../config/database")
const { v4: uuidv4 } = require('uuid')
const { sendOTP, verifyOTP } = require('../utils/sendOtpMail');
const containsSQLInjectionWords= require('../utils/sqlinjectioncheck');
//jwt
const jwt = require('jsonwebtoken')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt.utils")

// Function to update member hierarchy
const updateMemberHierarchy = async (newMember, upline) => {
  try {
    // Get kro existing hierarchy of the upline
    const [uplineHierarchy] = await db.query(
      'SELECT super_upline, upline, level FROM member_hierarchy WHERE member = ?',
      [upline]
    );

    
    await db.query(
      'INSERT INTO member_hierarchy (super_upline, upline, member, level) VALUES (?, ?, ?, ?)',
      [upline, upline, newMember, 1]
    );

    for (const row of uplineHierarchy) {
      if (row.level < 20) {
        await db.query(
          'INSERT INTO member_hierarchy (super_upline, upline, member, level) VALUES (?, ?, ?, ?)',
          [row.super_upline, upline, newMember, row.level + 1]
        );
      }
    }
  } catch (error) {
    console.error('Error updating member hierarchy:', error);
  }
};
// Add a new member
const addMember= async (newMember,upline) => {
  // const { newMember, upline } = req.body;
console.log(newMember, upline);
  try {
  
    const [uplineCheck] = await db.query('SELECT member FROM member_hierarchy WHERE upline = ? or member=? ', [upline,upline]);
    if (uplineCheck.length === 0) {
      return ({ error: 'Invalid upline' });
    }

    await updateMemberHierarchy(newMember, upline);

    return({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Error adding member:', error);
    return({ error: 'Internal server error' });
  }
};



// // Get list of member hierarchy
// router.post('/getlist',authenticateToken, async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM member_hierarchy ORDER BY member,level');
//     res.json(rows);
//   } catch (error) {
//     console.error('Error fetching member hierarchy:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



const checkSponserId = async (id) => {
  try {
    // Check if the id is "UP130566" and return false immediately
    if (id === "UP130566") {
      return false;
    }

    // Query to check if the id exists in either sponser_id or member_id
    const query = `SELECT 1 FROM member WHERE sponser_id = ? OR member_id = ? LIMIT 1`;
    const [rows] = await db.query(query, [id, id]);

    // If the query returns a row, the id exists
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking sponsor ID:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

// router.post('/checkSponserId', async(req, res) => {
//   const { sponser_id } = req.body;
//   //check for sql injection using function imported
//   if (containsSQLInjectionWords(sponser_id)) {
//     return res.status(400).json({ error: "Don't try to hack." });
//   }
//   console.log("check this  "+sponser_id);
//   try {
//     const isSponserIdValid = await checkSponserId(sponser_id);
//     var sponserName=[{ username: 'Invalid Sponsor Id' }]
//     if (isSponserIdValid){
//        [sponserName] = await db.query('SELECT username FROM usersdetails WHERE memberid =?',[sponser_id])
//     }
   
//     console.log("Checking",isSponserIdValid,sponserName[0].username);
//     res.json({ isValid: isSponserIdValid,
//       sponserName: sponserName[0].username
//     });
//   } catch (error) {
//     console.error('Error checking sponsor ID:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

///////////////////
const abc = async (placement_id, sponser_id,userId) => {
  const connection = await db.getConnection();
  try {
    //start connection
    await connection.beginTransaction();
    await connection.query(
      'INSERT INTO member (placement_id,sponser_id, member_id) VALUES (?, ?,?)',
      [placement_id,sponser_id, userId],
    );
    //commit the transaction
    await connection.commit();
    console.log("Member added successfully");
    await addMember(userId, placement_id);
  }
  

  catch (error) {
    console.error('Error in abc:', error);
    // res.status(500).json({ message: "Server error", error: error.message })
  }
  finally {
    connection.release()
  }
}
// abc("UHI-2222","UHI-2a1b3c","UHI-3333")


const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const [users] = await db.query(`
        SELECT id, firstname, lastname, email, phoneno, 
               address, city, state, pincode, role, 
               createdat, status
        FROM usersdetails
        ORDER BY createdat DESC
      `)
      
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  // Get a single user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.body
      const [user] = await db.query(`
        SELECT id, firstname, lastname, email, phoneno, 
               address, city, state, pincode, role, 
               createdat, status
        FROM usersdetails 
        WHERE id = ?
      `, [id])

      if (!user.length) {
        return res.status(404).json({ message: "User not found" })
      }


      res.status(200).json(user[0])
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    try {
      const { 
        firstname, lastname, email, password, 
        phoneno, address, city, state, pincode,otp,
        sponser_id, placement_id
      } = req.body
      console.log(req.body)

      // Check if user already exists
      const [existingUser] = await db.query(
        'SELECT id FROM usersdetails WHERE email = ? OR phoneno = ?', 
        [email, phoneno]
      )

      if (existingUser.length) {
        return res.status(400).json({ message: "User already exists" })
      }

       //check sponser id 
      const isSponserIdValid = await checkSponserId(sponser_id);
      if (!isSponserIdValid) {
        console.log("sponser id invalid mat bhej ")
        return res.status(200).json({ status: "false", error: "Invalid sponser ID." });
      }
      //chack placement id 
      const isPlacementIdValid = await checkSponserId(placement_id);
      if (!isPlacementIdValid) {
        console.log("placement id invalid mat bhej ")
        return res.status(200).json({ status: "false", error: "Invalid placement ID." });
      }
      // Check for SQL injection
      if (containsSQLInjectionWords(firstname) ||
          containsSQLInjectionWords(lastname) ||
          containsSQLInjectionWords(email) ||
          containsSQLInjectionWords(password) ||
          containsSQLInjectionWords(phoneno) ||
          containsSQLInjectionWords(address) ||
          containsSQLInjectionWords(city) ||
          containsSQLInjectionWords(state))
          // containsSQLInjectionWords(pincode) ||
          // containsSQLInjectionWords(sponser_id) ||
          // containsSQLInjectionWords(placement_id))
           {
        return res.status(400).json({ error: "Don't try to hack." });
      }
      
      
      // Validate OTP
      const result = await verifyOTP(email,otp);
      if (!result) {
        return res.status(400).json({ message: "Invalid OTP" })
      }
      

      // Generate unique user ID
      const userId = `UHI-${uuidv4().substring(0, 8)}`
      
      //create the connectoon 
      const connection = await db.getConnection();
      await connection.beginTransaction();
      // await connection.query(
      //   'INSERT INTO member (placement_id,sponser_id, member_id) VALUES (?, ?,?)',
      //   [placement_id,sponser_id, userId],
      // );
      // await addMember(userId, placement_id);
      await abc(placement_id,sponser_id, userId)

      // Create new user
      const [result1]=await connection.query(`
        INSERT INTO usersdetails (
          id, firstname, lastname, email, password, 
          phoneno, address, city, state, pincode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, firstname, lastname, email, password,
        phoneno, address, city, state, pincode,
      ])
      // Check if user was created successfully
      if (result1.affectedRows === 0) {
        await connection.rollback();
        return res.status(500).json({ message: "Failed to create user" })
      }
      

      res.status(201).json({ 
        message: "User created successfully",
        userId 
      })
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },
///////////////////
sendOtp:async function(req, res) {
  try {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
   const send=await sendOTP(email, 'registration');
   if(send){
    res.status(200).json({ message: 'OTP sent successfully' });
   }else{
    res.status(400).json({ message: 'OTP sent failed' });
   }
} catch (error) {
    console.error('Failed to send OTP:', error);
}},

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const result = await verifyOTP(email,otp);
      if (result.valid) {
          // OTP is valid
          console.log(result.message);
          res.status(200).json({ message: 'OTP verified successfully' });
      } else {
          // Invalid or expired OTP
          console.log(result.message);
          res.status(400).json({ message: 'Invalid OTP' });
       
      }
  } catch (error) {
      console.error('Failed to verify OTP:', error);
  }
  },

 


  /////////////////

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      const { 
        firstname, lastname, email, password, 
        phoneno, address, city, state, pincode, role, status 
      } = req.body

      // Check if user exists
      const [existingUser] = await db.query(
        'SELECT id FROM usersdetails WHERE id = ?', 
        [id]
      )

      if (!existingUser.length) {
        return res.status(404).json({ message: "User not found" })
      }

      // Update user
      await db.query(`
        UPDATE usersdetails 
        SET firstname = ?, lastname = ?, email = ?,
            ${password ? 'password = ?,' : ''} 
            phoneno = ?, address = ?, city = ?,
            state = ?, pincode = ?, role = ?, status = ?
        WHERE id = ?
      `, [
        firstname, lastname, email,
        ...(password ? [password] : []),
        phoneno, address, city, state, pincode, role, status, id
      ])

      res.json({ message: "User updated successfully" })
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params

      // Check if user exists
      const [existingUser] = await db.query(
        'SELECT id FROM usersdetails WHERE id = ?', 
        [id]
      )

      if (!existingUser.length) {
        return res.status(404).json({ message: "User not found" })
      }

      // Delete user
      await db.query('DELETE FROM usersdetails WHERE id = ?', [id])

      res.json({ message: "User deleted successfully" })
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },



  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body
  
      // Check if user exists
      const [user] = await db.query(
        'SELECT id, firstname, lastname, email, password, role FROM usersdetails WHERE email = ?',
        [email]
      )
  
      if (!user.length) {
        return res.status(401).json({ message: "Invalid email or password" })
      }
  
      // Check password (using bcrypt for security)
      const isMatch = (password===user[0].password?true:false)
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" })
      }
  
      // Generate tokens
      const accessToken = generateAccessToken({
        id: user[0].id,
        email: user[0].email,
        role: user[0].role
      })
  
      const refreshToken = generateRefreshToken({
        id: user[0].id
      })
  
      // Store refresh token in the database
      await db.query(
        `INSERT INTO user_tokens (user_id, refresh_token, created_at, updated_at)
         VALUES (?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
             refresh_token = VALUES(refresh_token),
             updated_at = NOW()`,
        [user[0].id, refreshToken]
      );
      
  
      res.json({
        message: "Login successful",
        user: {
          id: user[0].id,
          firstname: user[0].firstname,
          lastname: user[0].lastname,
          email: user[0].email,
          role: user[0].role
        },
        accessToken,
        refreshToken
      })
  
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  userLogout: async (req, res) => {
    try {
      const { refreshToken } = req.body

      // Check if refresh token exists
      const [token] = await db.query(
        'SELECT user_id FROM user_tokens WHERE refresh_token =?',
        [refreshToken]
      )
      if (!token.length) {
        return res.status(401).json({ message: "Invalid refresh token" })
      }
      // Delete refresh token from the database
      await db.query('DELETE FROM user_tokens WHERE refresh_token =?', [refreshToken])
      res.json({ message: "Logout successful" })
    } catch (error) {
      console.error("Logout error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },
  updateUserProfile: async (req, res) => {
    try {
      const { id } = req.user
      const { firstname, lastname, email, password, phoneno, address, city, state, pincode } = req.body
      // Check if user exists
      const [user] = await db.query(
        'SELECT id FROM usersdetails WHERE id =?',
        [id]
      )
      if (!user.length) {
        return res.status(404).json({ message: "User not found" })
      }
      // Update user profile
      await db.query(`
        UPDATE usersdetails
        SET firstname =?, lastname =?, email =?,
            ${password? 'password =?,' : ''}
            phoneno =?, address =?, city =?,
            state =?, pincode =?
        WHERE id =?
      `, [
        firstname, lastname, email,
        ...(password? [password] : []),
        phoneno, address, city, state, pincode,
        id
      ])
      res.json({ message: "User profile updated successfully" })
    } catch (error) {
      console.error("Update user profile error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },



  user_refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body
      // Check if refresh token exists
      const [token] = await db.query(
        'SELECT user_id FROM user_tokens WHERE refresh_token =?',
        [refreshToken]
      )
      if (!token.length) {
        return res.status(401).json({ message: "Invalid refresh token" })
      } 
      // Generate new access token
      const accessToken = generateAccessToken({
        id: token[0].id,
        email: token[0].email,
        role: token[0].role
      })
      res.json({ accessToken })
    } catch (error) {
      console.error("Refresh token error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

}

module.exports = userController


