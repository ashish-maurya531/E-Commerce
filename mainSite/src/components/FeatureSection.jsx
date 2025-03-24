import '../styles/FeatureSection.css';
const features = [
  { icon: 'fas fa-shipping-fast', text: 'Free Shipping' },
  { icon: 'fas fa-undo', text: 'Easy Returns' },
  { icon: 'fas fa-money-bill-wave', text: 'COD Available' },
  { icon: 'fas fa-lock', text: 'Secure Payments' }
];

function FeatureSection() {
  return (
    <div className="feature-section">
      {features.map((feature, index) => (
        <div key={index} className="feature-item">
          <div className="feature-icon">
            <i className={feature.icon}></i>
          </div>
          <span className="feature-text">{feature.text}</span>
        </div>
      ))}
    </div>
  );
}

export default FeatureSection;