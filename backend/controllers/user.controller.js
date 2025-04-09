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
const updateMemberHierarchy = async (newMember, upline, connection) => {
  console.log("Updating member hierarchy for:", newMember, "with upline:", upline);
  
  try {
    // Get existing hierarchy of the upline
    const [uplineHierarchy] = await connection.query(
      'SELECT super_upline, upline, level FROM member_hierarchy WHERE member = ?',
      [upline]
    );
    
    // Insert direct relationship (level 1)
    await connection.query(
      'INSERT INTO member_hierarchy (super_upline, upline, member, level) VALUES (?, ?, ?, ?)',
      [upline, upline, newMember, 1]
    );
    
    console.log("Direct relationship inserted (level 1)");

    // Insert higher level relationships
    for (const row of uplineHierarchy) {
      if (row.level < 20) {
        await connection.query(
          'INSERT INTO member_hierarchy (super_upline, upline, member, level) VALUES (?, ?, ?, ?)',
          [row.super_upline, upline, newMember, row.level + 1]
        );
        console.log(`Inserted level ${row.level + 1} relationship with super_upline:`, row.super_upline);
      }
    }
  } catch (error) {
    console.error('Error updating member hierarchy:', error);
    throw error; // Re-throw to be handled by the caller
  }
};
// Add a new member
const addMember = async (newMember, upline, connection) => {
  console.log("Adding member relationship:", newMember, upline);
  
  try {
    const [uplineCheck] = await connection.query(
      'SELECT member FROM member_hierarchy WHERE upline = ? OR member = ?', 
      [upline, upline]
    );
    
    if (uplineCheck.length === 0) {
      console.log("Invalid upline:", upline);
      throw new Error('Invalid upline');
    }

    await updateMemberHierarchy(newMember, upline, connection);
    console.log("Member added successfully to hierarchy");
    return true;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error; // Re-throw to be handled by the caller
  }
};







const checkSponserId = async (id) => {
  try {
    // Check if the id is "UP130566" and return false immediately
    // if (id === "UP130566") {
    //   return false;
    // }

    // Query to check if the id exists in either sponser_id or member_id
    const query = `SELECT 1 FROM member WHERE sponser_id = ? OR member_id = ? LIMIT 1`;
    const [rows] = await db.query(query, [id, id]);

    // If the query returns a row, the id exists
    console.log(rows.length>0? true : false)
    return (rows.length > 0? true : false);
  } catch (error) {
    console.error('Error checking sponsor ID:', error);
    throw error; // Re-throw the error for the caller to handle
  }
};

// checkSponserId("UHI-2a1b3c")

//chack placemment id
const checkPlacementId = async (id) => {
  try {
    // Step 1: Check if the ID exists in member_id
    const checkQuery = `SELECT 1 FROM member WHERE sponser_id = ? OR member_id = ? LIMIT 1`;
    const [checkRows] = await db.query(checkQuery, [id,id]);

    if (checkRows.length === 0) {
      console.log("Invalid placement ID: does not exist");
      return -1;
    }

    // Step 2: Count how many times the ID is used as placement_id
    const countQuery = `SELECT COUNT(*) AS count FROM member WHERE placement_id = ?`;
    const [countRows] = await db.query(countQuery, [id]);

    const count = countRows[0].count;

    console.log("Placement ID count:", count);
    return count;
   
  } catch (error) {
    console.error('Error checking placement ID:', error);
    throw error;
  }
};



// checkPlacementId("UHI-2222")




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
        phoneno, address, city, state, pincode,otp
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

      // Check for SQL injection
      if (containsSQLInjectionWords(firstname) ||
          containsSQLInjectionWords(lastname) ||
          containsSQLInjectionWords(email) ||
          containsSQLInjectionWords(password) ||
          containsSQLInjectionWords(phoneno) ||
          containsSQLInjectionWords(address) ||
          containsSQLInjectionWords(city) ||
          containsSQLInjectionWords(state)||
          containsSQLInjectionWords(pincode))
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
     

      // Create new user
      const [result1]=await connection.query(`
        INSERT INTO usersdetails (
          id, firstname, lastname, email, password, 
          phoneno, address, city, state, pincode,role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `, [
        userId, firstname, lastname, email, password,
        phoneno, address, city, state, pincode,"user"
      ])
      // Check if user was created successfully
      if (result1.affectedRows === 0) {
        await connection.rollback();
        return res.status(500).json({ message: "Failed to create user" })
      }
      await connection.commit();
      res.status(201).json({ 
        message: "User created successfully",
        userId 
      })
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },
///////////////////
createUser_distributer: async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const { 
      firstname, lastname, email, password, 
      phoneno, address, city, state, pincode, otp,
      sponser_id, placement_id
    } = req.body;
    
    console.log("Creating distributor with data:", req.body);

    // Begin transaction early to ensure all operations are atomic
    await connection.beginTransaction();

    // Check if user already exists
    const [existingUser] = await connection.query(
      'SELECT id FROM usersdetails WHERE email = ? OR phoneno = ?', 
      [email, phoneno]
    );

    if (existingUser.length) {
      console.log("User already exists with email or phone:", email, phoneno);
      return res.status(400).json({ status: "false", message: "User already exists" });
    }

    // Check sponser id 
    const isSponserIdValid = await checkSponserId(sponser_id);
    if (!isSponserIdValid) {
      console.log("Invalid sponsor ID:", sponser_id);
      return res.status(200).json({ status: "false", message: "Invalid sponsor ID." });
    }
    
    // Check placement id 
    const placementCount = await checkPlacementId(placement_id);
    if (placementCount === -1) {
      console.log("Invalid placement ID:", placement_id);
      return res.status(200).json({ status: "false", message: "Invalid placement ID." });
    }
    
    if (placementCount >= 5) {
      console.log("Placement ID reached its limit:", placement_id);
      return res.status(200).json({ status: "false", message: "Placement ID already has 5 placements." });
    }
    
    console.log("Placement ID is valid. Current placement count:", placementCount);
    
    // Check for SQL injection
    const inputFields = { firstname, lastname, email, password, phoneno, address, city, state, pincode, sponser_id, placement_id };
    for (const [field, value] of Object.entries(inputFields)) {
      if (containsSQLInjectionWords(value)) {
        console.log(`SQL injection attempt detected in field: ${field}`);
        return res.status(400).json({ status: "false", message: "Invalid input detected." });
      }
    }
    
    // Validate OTP
    const otpValid = await verifyOTP(email, otp);
    if (!otpValid) {
      console.log("Invalid OTP for email:", email);
      return res.status(400).json({ status: "false", message: "Invalid OTP" });
    }

    // Generate unique user ID
    const userId = `UHI-${uuidv4().substring(0, 8)}`;
    console.log("Generated user ID:", userId);
    
    // Create member relationship first
    try {
      await connection.query(
        'INSERT INTO member (placement_id, sponser_id, member_id) VALUES (?, ?, ?)',
        [placement_id, sponser_id, userId]
      );
      
      console.log("Member relationship created successfully");
      
      // Update member hierarchy
      await addMember(userId, placement_id, connection);
    } catch (memberError) {
      console.error("Error creating member relationship:", memberError);
      await connection.rollback();
      return res.status(500).json({ status: "false", message: "Failed to create member relationship", error: memberError.message });
    }

    // Create new user
    try {
      const [userResult] = await connection.query(`
        INSERT INTO usersdetails (
          id, firstname, lastname, email, password, 
          phoneno, address, city, state, pincode,role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
      `, [
        userId, firstname, lastname, email, password,
        phoneno, address, city, state, pincode, "distributer"
      ]);
      
      if (userResult.affectedRows === 0) {
        throw new Error("Failed to insert user details");
      }
      
      console.log("User details inserted successfully");
    } catch (userError) {
      console.error("Error creating user:", userError);
      await connection.rollback();
      return res.status(500).json({ status: "false", message: "Failed to create user", error: userError.message });
    }

    // Commit transaction after all operations succeed
    await connection.commit();
    console.log("Distributor created successfully with ID:", userId);
    
    res.status(201).json({ 
      status: "true",
      message: "Distributor created successfully",
      userId 
    });
    
  } catch (error) {
    console.error("Server error in createUser_distributer:", error);
    
    // Rollback transaction on error
    if (connection) {
      try {
        await connection.rollback();
        console.log("Transaction rolled back due to error");
      } catch (rollbackError) {
        console.error("Error rolling back transaction:", rollbackError);
      }
    }
    
    res.status(500).json({ status: "false", message: "Server error", error: error.message });
  } finally {
    // Always release connection
    if (connection) {
      connection.release();
      console.log("Database connection released");
    }
  }
},

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


