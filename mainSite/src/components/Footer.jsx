import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const styles = {
  footer: {
    backgroundColor: '#531C1B',
    color: 'white',
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif'
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  contact: {
    fontSize: '14px',
    marginBottom: '15px',
    lineHeight: '1.5'
  },
  social: {
    display: 'flex',
    gap: '10px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.3s ease'
  },
  linkHover: {
    color: '#c29358'
  },
  newsletter: {
    display: 'flex',
    marginTop: '10px'
  },
  input: {
    padding: '10px',
    width: '100%',
    border: 'none',
    borderRadius: '4px 0 0 4px'
  },
  button: {
    padding: '10px 15px',
    backgroundColor: '#c29358',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  buttonHover: {
    backgroundColor: '#b58340'
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #774141',
    paddingTop: '15px',
    fontSize: '14px',
    marginTop: '20px'
  },
  developer: {
    color: '#b5b5b5'
  },
  list: {
    padding: 0,
    listStyle: 'none'
  }
};

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Left Section */}
        <div style={styles.section}>
          <h2 style={styles.title}>UNIQUE HERBAL INDUSTRY®</h2>
          <div style={styles.contact}>
            📞 +91 8885978692  
            <br />
            ✉️ info@uhistore.com
          </div>
          <div style={styles.social}>
            <a href="#" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>
              <FaFacebookF />
            </a>
            <a href="#" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>
              <FaInstagram />
            </a>
            <a href="#" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Categories Section */}
        <div style={styles.section}>
          <h3 style={styles.title}>CATEGORIES</h3>
          <ul style={styles.list}>
            {[
              'General Health & Wellness', 'Mens Health', 'Womens Health', 
              'Eye & Vision Care', 'Skin & Hair Care',
              'Digestive Health', 'New Arrival', 'Joint & Bone', 
              'Track Order', 'Return Your Order', 'Store Locator'
            ].map((item) => (
              <li key={item}>
                <a href="#" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links Section */}
        <div style={styles.section}>
          <h3 style={styles.title}>QUICK LINKS</h3>
          <ul style={styles.list}>
            {[
              'Track Order', 'Account', 'About Us', 'Contact Us', 
              'Store Locator', 'Refunds & Cancellations Policy', 
              'Terms of Service', 'Privacy Policy', 'Return Your Order'
            ].map((item) => (
              <li key={item}>
                <a href="#" style={styles.link} onMouseOver={(e) => e.target.style.color = styles.linkHover.color} onMouseOut={(e) => e.target.style.color = styles.link.color}>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div style={styles.section}>
          <h3 style={styles.title}>NEWSLETTER</h3>
          <p>A short sentence describing what someone will receive by subscribing.</p>
          <div style={styles.newsletter}>
            <input type="email" placeholder="Enter Your Email" style={styles.input} />
            <button
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
            >
              ➔
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={styles.bottom}>
        <div>India (INR ₹)</div>
        <div>© 2025 Unique Herbal Industry | All Rights Reserved</div>
        <div style={styles.developer}>Developed by Lexcorp Softwares</div>
      </div>
    </footer>
  );
}

export default Footer;