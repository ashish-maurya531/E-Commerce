import { useState, useEffect } from "react";
import "../styles/auth-styles.css";
import { Link,useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState({
    name: "",
    loginIdentifier: "", // Single field for login (email or phone)
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [tempFormData, setTempFormData] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/[^0-9]/g, ""));

  const validateForm = () => {
    const tempErrors = {};

    if (!isLoginForm) {
      if (!formData.name.trim()) tempErrors.name = "Name is required";
      if (!formData.email || !isValidEmail(formData.email)) tempErrors.email = "Valid email is required";
      if (!formData.phone || !isValidPhone(formData.phone)) tempErrors.phone = "Valid phone number is required";
    } else {
      if (!formData.loginIdentifier) {
        tempErrors.loginIdentifier = "Email or phone number is required";
      } else if (
        !isValidEmail(formData.loginIdentifier) &&
        !isValidPhone(formData.loginIdentifier)
      ) {
        tempErrors.loginIdentifier = "Enter a valid email or phone number";
      }
    }

    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      if (isLoginForm) {
        console.log("Login submitted:", formData);
        alert("Login successful!");
        localStorage.setItem("authToken", "your-token-here"); // For demo purposes
        navigate("/home");
        setFormData({ name: "", loginIdentifier: "", email: "", phone: "", password: "" });
      } else {
        setTempFormData({ ...formData });
        setShowOtpVerification(true);
        console.log("OTP sent to", formData.phone);
        alert(`OTP sent to ${formData.phone}. For demo, use 123456.`);
      }
    }
  };

  if (showOtpVerification) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1>Verify Your Account</h1>
          <p>Enter the 6-digit code sent to {tempFormData.phone}</p>
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => {
                  let value = e.target.value.slice(0, 1);
                  let newOtp = [...otp];
                  newOtp[index] = value;
                  setOtp(newOtp);
                  if (value && index < 5) {
                    document.getElementById(`otp-${index + 1}`).focus();
                  }
                }}
                className="otp-input"
                autoFocus={index === 0}
              />
            ))}
          </div>
          <button onClick={() => alert("OTP Verified!")} className="submit-btn">
            Verify OTP
          </button>
          <button onClick={() => alert("OTP Resent!")} className="otp-action-btn">
            Resend OTP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 style={
          {
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem"
          }
        }>{isLoginForm ? "Welcome Back" : "Create Account"}</h1>
        <p style={
          {
            textAlign: "center",
            marginBottom: "1.5rem"
          }
        }>{isLoginForm ? "Login to your account" : "Sign up to get started"}</p>

        <div className="form-toggle">
          <button className={isLoginForm ? "active" : ""} onClick={() => setIsLoginForm(true)}>
            Login
          </button>
          <button className={!isLoginForm ? "active" : ""} onClick={() => setIsLoginForm(false)}>
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginForm && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
          )}

          {isLoginForm ? (
            <div className="form-group">
              <label htmlFor="loginIdentifier">Email or Phone</label>
              <input type="text" id="loginIdentifier" name="loginIdentifier" value={formData.loginIdentifier} onChange={handleChange} placeholder="Enter your email or phone" />
              {errors.loginIdentifier && <span className="error">{errors.loginIdentifier}</span>}
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>

          {isLoginForm && (
            <div className="forgot-password">
              <a href="#" onClick={() => alert("Forgot password functionality here!")}>
                Forgot Password?
              </a>
            </div>
          )}

          <button type="submit" className="submit-btn">
            {isLoginForm ? "Login" : "Continue"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginForm ? "Don't have an account? " : "Already have an account? "}
            <button className="toggle-link" onClick={() => setIsLoginForm(!isLoginForm)}>
              {isLoginForm ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
