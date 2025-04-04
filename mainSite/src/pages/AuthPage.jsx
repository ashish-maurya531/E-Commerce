// import { useState, useEffect } from "react";
// import "../styles/auth-styles.css";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";




// const Src = import.meta.env.VITE_Src;

// export default function AuthPage() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [isLoginForm, setIsLoginForm] = useState(true);
//   const [isOTPSent, setIsOTPSent] = useState(false);
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const [timer, setTimer] = useState(0);
//   const [formData, setFormData] = useState({
//     // name: "",
//     loginIdentifier: "", // Single field for login (email or phone)
//     email: "",
//     phoneno: "",
//     password: "",
//     firstname: "",
//     lastname: "",
//     otp: !!otp||"",
//   });
//   const [errors, setErrors] = useState({});
//   const [tempFormData, setTempFormData] = useState(null);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
// };

//   const handleLogin = async () => {
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     console.log("Handle Login Data:", formData);
//     try {
//       const response = await axios.post(
//         `${Src}/api/users/user-login`,
//         {
//           email : formData.loginIdentifier,
//           password : formData.password,
//         }
//       );
//       setSuccess("Login successful!");
//       console.log("Response Data:", response.data);
//       localStorage.setItem("accessToken", response.data.accessToken);
//       localStorage.setItem("refreshToken", response.data.refreshToken);
//       navigate("/home");
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError(err.response?.data?.message || "Login failed. Try again.");
//     } finally {
//       console.log("nothing");
//       setLoading(false);
//     }
//   };

//   const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
//   const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/[^0-9]/g, ""));

//   const validateForm = () => {
//     const tempErrors = {};

//     if (!isLoginForm) {
//       // if (!formData.name.trim()) tempErrors.name = "Name is required";
//       if (!formData.firstname.trim()) tempErrors.name = "First name is required";
//       if (!formData.lastname.trim()) tempErrors.name = "Last name is required";
//       if (!formData.email || !isValidEmail(formData.email))
//         tempErrors.email = "Valid email is required";
//       if (!formData.phone || !isValidPhone(formData.phone))
//         tempErrors.phone = "Valid phone number is required";
//     } else {
//       if (!formData.loginIdentifier) {
//         tempErrors.loginIdentifier = "Email or phone number is required";
//       } else if (
//         !isValidEmail(formData.loginIdentifier) &&
//         !isValidPhone(formData.loginIdentifier)
//       ) {
//         tempErrors.loginIdentifier = "Enter a valid email or phone number";
//       }
//     }

//     if (!formData.password) {
//       tempErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       tempErrors.password = "Password must be at least 6 characters";
//     }

//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };
//   const handleRegister = (formData) => {
//     setLoading(true);
//     setError("");
//     setSuccess("");
//     console.log("Handle Register Data:", formData);
//     //check if otp is sent or not 
//     if (!isOTPSent) {
//       setError("Please send OTP first.");
//       return;
//     }
//     try {
//       const response = axios.post(
//         `${Src}/api/users/`,
//         formData
//       );
//       setSuccess("Registration successful!");
//       console.log("Response Data:", response.data);
//       localStorage.setItem("accessToken", response.data.accessToken);
//       localStorage.setItem("refreshToken", response.data.refreshToken);
//       navigate("/home");
//     } catch (err) {
//       console.error("Registration Error:", err);
//       setError(err.response?.data?.message || "Registration failed. Try again.");
//     } finally {
//       console.log("nothing");
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data:", formData);
//     console.log("Is Login Form:", isLoginForm);
//     if (validateForm()) {
//       if (isLoginForm) {
//         console.log("Login Form Data:", formData);
//         // Handle login
//         handleLogin();
//       } else {
//         // Handle OTP-based signup
//         setTempFormData({ ...formData });
//         // sendOTP();
//         handleRegister(formData);

//         setIsOTPSent(true);
//       }
//     }
//   };

//   useEffect(() => {
//     let interval;
//     if (timer > 0) {
//       interval = setInterval(() => {
//         setTimer((prev) => prev - 1);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [timer]);

//   const sendOTP = async () => {
//     try {
//       await axios.post(
//         `${Src}/api/users/send-otp`,
//         {
//           email: formData.email,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }
//       );
  
//       setIsOTPSent(true);
//       setTimer(60); // Start 60s countdown
//       console.log("OTP sent successfully");
//     } catch (error) {
//       console.error("Failed to send OTP", error);
//     }
//   };
//   return (
//     <div className="auth-container">
//       <div className="auth-card">
//         <h1
//           style={{
//             textAlign: "center",
//             fontSize: "2rem",
//             fontWeight: "bold",
//             marginBottom: "1rem",
//           }}
//         >
//           {isLoginForm ? "Welcome Back" : "Create Account"}
//         </h1>
//         <p
//           style={{
//             textAlign: "center",
//             marginBottom: "1.5rem",
//           }}
//         >
//           {isLoginForm ? "Login to your account" : "Sign up to get started"}
//         </p>

//         <div className="form-toggle">
//           <button
//             className={isLoginForm ? "active" : ""}
//             onClick={() => setIsLoginForm(true)}
//           >
//             Login
//           </button>
//           <button
//             className={!isLoginForm ? "active" : ""}
//             onClick={() => setIsLoginForm(false)}
//           >
//             Sign Up
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="auth-form">
//           {/* Full Name (only for signup) */}
//           {!isLoginForm && (
//             <div className="form-group">
//               <label htmlFor="firstname">First Name</label>
//               <input
//                 type="text"
//                 id="firstname"
//                 name="firstname"
//                 value={formData.firstname}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//               />
//               <label htmlFor="lastname">Last Name</label>
//               <input
//                 type="text"
//                 id="lastname"
//                 name="lastname"
//                 value={formData.lastname}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//               />
//               {errors.name && <span className="error">{errors.name}</span>}
//             </div>
//           )}

//           {/* Email or Phone for Login */}
//           {isLoginForm ? (
//             <div className="form-group">
//               <label htmlFor="loginIdentifier">Email or Phone</label>
//               <input
//                 type="text"
//                 id="loginIdentifier"
//                 name="loginIdentifier"
//                 value={formData.loginIdentifier} // ✅ Fixed incorrect field
//                 onChange={handleChange}
//                 placeholder="Enter your email or phone"
//               />
//               {errors.loginIdentifier && (
//                 <span className="error">{errors.loginIdentifier}</span> // ✅ Fixed error handling
//               )}
//             </div>
//           ) : (
//             <>
//               {/* Email for Signup */}
//               <div className="form-group">
//                 <label htmlFor="email">Email</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email"
//                 />
//                 {errors.email && <span className="error">{errors.email}</span>}
//               </div>

//               {/* Phone for Signup */}
//               <div className="form-group">
//                 <label htmlFor="phoneno">Phone</label>
//                 <input
//                   type="tel"
//                   id="phoneno"
//                   name="phoneno"
//                   value={formData.phoneno}
//                   onChange={handleChange}
//                   placeholder="Enter your phone number"
//                 />
//                 {errors.phoneno && <span className="error">{errors.phoneno}</span>}
//               </div>
//             </>
//           )}

//           {/* Password Field */}
//           <div className="form-group">
//             <label htmlFor="password">Password</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//             />
//             {errors.password && (
//               <span className="error">{errors.password}</span>
//             )}
//           </div>

//           {/* Forgot Password (Only for Login) */}
//           {isLoginForm && (
//             <div className="forgot-password">
//               <a
//                 href="#"
//                 onClick={() => alert("Forgot password functionality here!")}
//               >
//                 Forgot Password?
//               </a>
//             </div>
//           )}

//           {/* OTP Section (Only for Signup) */}
//           {!isLoginForm && (
//             <div>
//               <div className="otp-container">
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     id={`otp-${index}`}
//                     type="text"
//                     maxLength="1"
//                     value={digit}
//                     onChange={(e) => {
//                       let value = e.target.value.slice(0, 1);
//                       let newOtp = [...otp];
//                       newOtp[index] = value;
//                       setOtp(newOtp);
//                       if (value && index < 5) {
//                         document.getElementById(`otp-${index + 1}`).focus();
//                       }
//                     }}
//                     className="otp-input"
//                     autoFocus={index === 0}
//                   />
//                 ))}
//               </div>
//               <button
//                 className="otp-btn"
//                 onClick={sendOTP}
//                 disabled={timer > 0}
//               >
//                 {!isOTPSent
//                   ? "Send OTP"
//                   : timer > 0
//                   ? `Resend OTP in ${timer}s`
//                   : "Resend OTP"}
//               </button>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button type="submit" className="submit-btn">
//             {isLoginForm ? "Login" : "Register"}
//           </button>
//         </form>

//         <div className="auth-footer">
//           <p>
//             {isLoginForm
//               ? "Don't have an account? "
//               : "Already have an account? "}
//             <button
//               className="toggle-link"
//               onClick={() => setIsLoginForm(!isLoginForm)}
//             >
//               {isLoginForm ? "Sign Up" : "Login"}
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import "../styles/auth-styles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Src = import.meta.env.VITE_Src;

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  
  // OTP state as an array for individual digit inputs
  const [otp, setOtp] = useState(new Array(6).fill(""));
  
  // Form data with proper initialization
  const [formData, setFormData] = useState({
    loginIdentifier: "",
    email: "",
    phoneno: "",
    password: "",
    firstname: "",
    lastname: ""
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation functions
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/[^0-9]/g, ""));

  // Login handler
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await axios.post(
        `${Src}/api/users/user-login`,
        {
          email: formData.loginIdentifier, // Using loginIdentifier for email login
          password: formData.password,
        }
      );
      
      setSuccess("Login successful!");
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const handleRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    
    // Check if OTP is sent
    if (!isOTPSent) {
      setError("Please verify your email/phone with OTP first.");
      setLoading(false);
      return;
    }

    // Combine OTP digits into a single string
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await axios.post(
        `${Src}/api/users/`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          phoneno: formData.phoneno,
          password: formData.password,
          otp: otpString
        }
      );
      
      // Show success card instead of redirecting
      setShowSuccessCard(true);
      setSuccess("Registration successful!");
      
      // Don't store tokens yet since they'll need to login
      // localStorage.setItem("accessToken", response.data.accessToken);
      // localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (err) {
      console.error("Registration Error:", err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const tempErrors = {};

    if (!isLoginForm) {
      // Registration validation
      if (!formData.firstname.trim()) tempErrors.firstname = "First name is required";
      if (!formData.lastname.trim()) tempErrors.lastname = "Last name is required";
      
      if (!formData.email) {
        tempErrors.email = "Email is required";
      } else if (!isValidEmail(formData.email)) {
        tempErrors.email = "Please enter a valid email";
      }
      
      if (!formData.phoneno) {
        tempErrors.phoneno = "Phone number is required";
      } else if (!isValidPhone(formData.phoneno)) {
        tempErrors.phoneno = "Please enter a valid 10-digit phone number";
      }
    } else {
      // Login validation
      if (!formData.loginIdentifier) {
        tempErrors.loginIdentifier = "Email or phone number is required";
      } else if (
        !isValidEmail(formData.loginIdentifier) &&
        !isValidPhone(formData.loginIdentifier)
      ) {
        tempErrors.loginIdentifier = "Enter a valid email or phone number";
      }
    }

    // Password validation for both forms
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (isLoginForm) {
        handleLogin();
      } else {
        handleRegister();
      }
    }
  };

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Send OTP handler
  const sendOTP = async () => {
    if (!formData.email || !isValidEmail(formData.email)) {
      setError("Please enter a valid email to send OTP");
      return;
    }
    
    try {
      setLoading(true);
      await axios.post(
        `${Src}/api/users/send-otp`,
        {
          email: formData.email,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      setIsOTPSent(true);
      setTimer(60); // Start 60s countdown
      setError("");
      setSuccess("OTP sent successfully to your email");
    } catch (error) {
      console.error("Failed to send OTP", error);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form when toggling between login and signup
  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
    setFormData({
      loginIdentifier: "",
      email: "",
      phoneno: "",
      password: "",
      firstname: "",
      lastname: ""
    });
    setOtp(new Array(6).fill(""));
    setIsOTPSent(false);
    setError("");
    setSuccess("");
    setShowSuccessCard(false);
  };

  // Handle proceed to login from success card
  const handleProceedToLogin = () => {
    setShowSuccessCard(false);
    setIsLoginForm(true);
    setFormData({
      loginIdentifier: formData.email, // Pre-fill with registered email
      email: "",
      phoneno: "",
      password: "",
      firstname: "",
      lastname: ""
    });
    navigate("/auth"); // Redirect to auth page
  };

  // Success card to show after registration
  const SuccessCard = () => (
    <div className="success-card">
      <div className="success-icon">✓</div>
      <h2>Registration Successful!</h2>
      <p>Your account has been created successfully.</p>
      <p>Please login to continue.</p>
      <button 
        className="submit-btn" 
        onClick={handleProceedToLogin}
      >
        Proceed to Login
      </button>
    </div>
  );

  // Main content to render
  if (showSuccessCard) {
    return (
      <div className="auth-container">
        <SuccessCard />
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          {isLoginForm ? "Welcome Back" : "Create Account"}
        </h1>
        <p
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          {isLoginForm ? "Login to your account" : "Sign up to get started"}
        </p>

        <div className="form-toggle">
          <button
            className={isLoginForm ? "active" : ""}
            onClick={() => toggleForm()}
            type="button"
          >
            Login
          </button>
          <button
            className={!isLoginForm ? "active" : ""}
            onClick={() => toggleForm()}
            type="button"
          >
            Sign Up
          </button>
        </div>
        
        {/* Error and Success Messages */}
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Registration Form Fields */}
          {!isLoginForm && (
            <>
              <div className="form-group">
                <label htmlFor="firstname">First Name</label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
                {errors.firstname && <span className="error">{errors.firstname}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastname">Last Name</label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
                {errors.lastname && <span className="error">{errors.lastname}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phoneno">Phone</label>
                <input
                  type="tel"
                  id="phoneno"
                  name="phoneno"
                  value={formData.phoneno}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phoneno && <span className="error">{errors.phoneno}</span>}
              </div>
            </>
          )}

          {/* Login Form Fields */}
          {isLoginForm && (
            <div className="form-group">
              <label htmlFor="loginIdentifier">Email or Phone</label>
              <input
                type="text"
                id="loginIdentifier"
                name="loginIdentifier"
                value={formData.loginIdentifier}
                onChange={handleChange}
                placeholder="Enter your email or phone"
              />
              {errors.loginIdentifier && (
                <span className="error">{errors.loginIdentifier}</span>
              )}
            </div>
          )}

          {/* Password Field (Both Forms) */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          {/* Forgot Password (Only for Login) */}
          {isLoginForm && (
            <div className="forgot-password">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Forgot password functionality here!");
                }}
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* OTP Section (Only for Signup) */}
          {!isLoginForm && (
            <div className="otp-section">
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 1);
                      const newOtp = [...otp];
                      newOtp[index] = value;
                      setOtp(newOtp);
                      
                      // Auto-focus next input on digit entry
                      if (value && index < 5) {
                        document.getElementById(`otp-${index + 1}`).focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Move to previous input on backspace if current is empty
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        document.getElementById(`otp-${index - 1}`).focus();
                      }
                    }}
                    className="otp-input"
                  />
                ))}
              </div>
              
              <button
                type="button"
                className="otp-btn"
                onClick={sendOTP}
                disabled={timer > 0 || loading}
              >
                {!isOTPSent
                  ? "Send OTP"
                  : timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading || (!isLoginForm && !isOTPSent)}
          >
            {loading ? "Processing..." : isLoginForm ? "Login" : "Register"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginForm
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              type="button"
              className="toggle-link"
              onClick={toggleForm}
            >
              {isLoginForm ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}