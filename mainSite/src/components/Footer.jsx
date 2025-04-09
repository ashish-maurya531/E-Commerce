import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
  const categories = [
    'General Health & Wellness', 'Mens Health', 'Womens Health',
    'Eye & Vision Care', 'Skin & Hair Care', 'Digestive Health',
    'New Arrival', 'Joint & Bone', 'Track Order',
    'Return Your Order', 'Store Locator'
  ];

  const quickLinks = [
    'Track Order', 'Account', 'About Us', 'Contact Us',
    'Store Locator', 'Refunds & Cancellations Policy',
    'Terms of Service', 'Privacy Policy', 'Return Your Order'
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-section">
          <h2 className="footer-title">UNIQUE HERBAL INDUSTRY®</h2>
          <div className="footer-contact">
            📞 +91 8885978692<br />
            ✉️ info@uhistore.com
          </div>
          <div className="footer-social">
            <a href="#" className="footer-link"><FaFacebookF /></a>
            <a href="#" className="footer-link"><FaInstagram /></a>
            <a href="#" className="footer-link"><FaYoutube /></a>
          </div>
        </div>

        {/* Categories Section */}
        <div className="footer-section">
          <h3 className="footer-title">CATEGORIES</h3>
          <ul className="footer-list">
            {categories.map((item) => (
              <li key={item}>
                <a href="#" className="footer-link">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">QUICK LINKS</h3>
          <ul className="footer-list">
            {quickLinks.map((item) => (
              <li key={item}>
                <a href="#" className="footer-link">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section">
          <h3 className="footer-title">NEWSLETTER</h3>
          <p className="footer-news-text">
            A short sentence describing what someone will receive by subscribing.
          </p>
          <div className="footer-newsletter">
            <input type="email" placeholder="Enter Your Email" className="footer-input" />
            <button className="footer-button">➔</button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div>India (INR ₹)</div>
        <div>© 2025 Unique Herbal Industry | All Rights Reserved</div>
        <div className="footer-developer">Developed by Lexcorp Softwares</div>
      </div>
    </footer>
  );
}

export default Footer;