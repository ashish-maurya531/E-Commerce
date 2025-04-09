"use client"

import { useState } from "react"
import "../../../styles/AddressPayment.css"

export default function AddressPayment({ user }) {
  const [activeTab, setActiveTab] = useState("addresses")

  return (
    <div className="profile-card address-payment-card">
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "addresses" ? "active" : ""}`}
          onClick={() => setActiveTab("addresses")}
        >
          Shipping Addresses
        </button>
        <button
          className={`tab-button ${activeTab === "payment" ? "active" : ""}`}
          onClick={() => setActiveTab("payment")}
        >
          Payment Methods
        </button>
      </div>

      {activeTab === "addresses" && (
        <div className="addresses-container">
          <h2>Shipping Addresses</h2>
          <div className="addresses-list">
            {user.addresses.map((address) => (
              <div key={address.id} className={`address-item ${address.isDefault ? "default" : ""}`}>
                {address.isDefault && <span className="default-badge">Default</span>}
                <h3>{address.type}</h3>
                <p>{address.street}</p>
                <p>
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p>{address.country}</p>
                <div className="address-actions">
                  <button className="btn-small">Edit</button>
                  {!address.isDefault && <button className="btn-small">Set as Default</button>}
                  {!address.isDefault && <button className="btn-small btn-danger">Remove</button>}
                </div>
              </div>
            ))}
            <div className="address-item add-new">
              <div className="add-new-content">
                <span className="add-icon">+</span>
                <span>Add New Address</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "payment" && (
        <div className="payment-methods-container">
          <h2>Payment Methods</h2>
          <div className="payment-methods-list">
            {user.paymentMethods.map((method) => (
              <div key={method.id} className={`payment-method-item ${method.isDefault ? "default" : ""}`}>
                {method.isDefault && <span className="default-badge">Default</span>}
                <div className="card-info">
                  <div className="card-type">{method.cardType}</div>
                  <div className="card-number">•••• •••• •••• {method.lastFourDigits}</div>
                  <div className="card-expiry">Expires: {method.expiryDate}</div>
                </div>
                <div className="payment-actions">
                  <button className="btn-small">Edit</button>
                  {!method.isDefault && <button className="btn-small">Set as Default</button>}
                  {!method.isDefault && <button className="btn-small btn-danger">Remove</button>}
                </div>
              </div>
            ))}
            <div className="payment-method-item add-new">
              <div className="add-new-content">
                <span className="add-icon">+</span>
                <span>Add New Payment Method</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
