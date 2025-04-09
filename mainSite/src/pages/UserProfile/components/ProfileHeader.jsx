import "../../../styles/ProfileHeader.css"

export default function ProfileHeader({ user }) {
  return (
    <div className="profile-card profile-header">
      <h2>Profile Information</h2>
      <div className="profile-header-content">
        <div className="profile-image-container">
          <img src={user.profileImage || "/placeholder.svg"} alt={`${user.name}'s profile`} className="profile-image" />
        </div>
        <div className="profile-details">
          <div className="profile-detail-item">
            <span className="detail-label">Name</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user.phone}</span>
          </div>
          <div className="profile-detail-item">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">January 2022</span>
          </div>
        </div>
      </div>
    </div>
  )
}
