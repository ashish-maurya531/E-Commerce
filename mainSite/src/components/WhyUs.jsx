import { FaCapsules, FaHeartbeat, FaFlask, FaLeaf, FaHandHoldingHeart, FaShieldAlt } from "react-icons/fa";

const styles = {
  organicQualities: {
    backgroundColor: '#2c1d1b',
    padding: '40px',
    textAlign: 'center',
    color: '#fff',
  },
  qualitiesTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '30px',
  },
  qualitiesList: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
  },
  qualityItem: {
    backgroundColor: '#c9a76a',
    padding: '20px',
    borderRadius: '12px',
    width: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.3s ease',
  },
  qualityIcon: {
    fontSize: '2.5rem',
    color: '#fff',
    marginBottom: '10px',
  },
  qualityText: {
    fontSize: '1rem',
    fontWeight: '500',
    color: '#fff',
  }
};

function WhyUs() {
  const qualities = [
    { icon: <FaLeaf />, text: "100% Herbal & Natural" },
    { icon: <FaCapsules />, text: "Scientifically Formulated" },
    { icon: <FaShieldAlt />, text: "Boosts Immunity & Overall Health" },
    { icon: <FaFlask />, text: "No Harmful Chemicals" },
    { icon: <FaHeartbeat />, text: "Supports Holistic Wellness" },
    { icon: <FaHandHoldingHeart />, text: "Trusted & Safe for Daily Use" }
];

  return (
    <div style={styles.organicQualities}>
      <h2 style={styles.qualitiesTitle}>Why Choose Herbal?</h2>
      <div style={styles.qualitiesList}>
        {qualities.map((item, index) => (
          <div
            key={index}
            style={styles.qualityItem}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={styles.qualityIcon}>{item.icon}</div>
            <span style={styles.qualityText}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyUs;