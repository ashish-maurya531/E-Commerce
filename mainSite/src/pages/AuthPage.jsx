import { useState, useEffect } from "react";
import "../styles/auth-styles.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";




const Src = import.meta.env.VITE_Src;

export default function AuthPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(0);
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

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    console.log("Handle Login Data:", formData);
    try {
      const response = await axios.post(
        `${Src}/api/users/user-login`,
        {
          email : formData.loginIdentifier,
          password : formData.password,
        }
      );
      setSuccess("Login successful!");
      console.log("Response Data:", response.data);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      navigate("/home");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      console.log("nothing");
      setLoading(false);
    }
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone) => /^\d{10}$/.test(phone.replace(/[^0-9]/g, ""));

  const validateForm = () => {
    const tempErrors = {};

    if (!isLoginForm) {
      if (!formData.name.trim()) tempErrors.name = "Name is required";
      if (!formData.email || !isValidEmail(formData.email))
        tempErrors.email = "Valid email is required";
      if (!formData.phone || !isValidPhone(formData.phone))
        tempErrors.phone = "Valid phone number is required";
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
    console.log("Form Data:", formData);
    console.log("Is Login Form:", isLoginForm);
    if (validateForm()) {
      if (isLoginForm) {
        console.log("Login Form Data:", formData);
        // Handle login
        handleLogin();
      } else {
        // Handle OTP-based signup
        setTempFormData({ ...formData });
        sendOTP();
        setIsOTPSent(true);
      }
    }
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendOTP = async () => {
    try {
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
      console.log("OTP sent successfully");
    } catch (error) {
      console.error("Failed to send OTP", error);
    }
  };
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
            onClick={() => setIsLoginForm(true)}
          >
            Login
          </button>
          <button
            className={!isLoginForm ? "active" : ""}
            onClick={() => setIsLoginForm(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name (only for signup) */}
          {!isLoginForm && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
          )}

          {/* Email or Phone for Login */}
          {isLoginForm ? (
            <div className="form-group">
              <label htmlFor="loginIdentifier">Email or Phone</label>
              <input
                type="text"
                id="loginIdentifier"
                name="loginIdentifier"
                value={formData.loginIdentifier} // ✅ Fixed incorrect field
                onChange={handleChange}
                placeholder="Enter your email or phone"
              />
              {errors.loginIdentifier && (
                <span className="error">{errors.loginIdentifier}</span> // ✅ Fixed error handling
              )}
            </div>
          ) : (
            <>
              {/* Email for Signup */}
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

              {/* Phone for Signup */}
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </>
          )}

          {/* Password Field */}
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
                onClick={() => alert("Forgot password functionality here!")}
              >
                Forgot Password?
              </a>
            </div>
          )}

          {/* OTP Section (Only for Signup) */}
          {!isLoginForm && (
            <div>
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
              <button
                className="otp-btn"
                onClick={sendOTP}
                disabled={timer > 0}
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
          <button type="submit" className="submit-btn">
            {isLoginForm ? "Login" : "Continue"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginForm
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              className="toggle-link"
              onClick={() => setIsLoginForm(!isLoginForm)}
            >
              {isLoginForm ? "Sign Up" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
