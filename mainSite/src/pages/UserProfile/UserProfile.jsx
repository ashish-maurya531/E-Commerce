"use client"

import { useState } from "react"
import ProfileHeader from "./components/ProfileHeader"
import AddressPayment from "./components/AddressPayment"
import OrderHistory from "./components/OrderHistory"
import Wishlist from "./components/Wishlist"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "../../styles/UserProfile.css"

export default function UserProfile() {
  const [user, setUser] = useState({
    id: "12345",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1 (555) 123-4567",
    profileImage: "/placeholder.svg?height=150&width=150",
    addresses: [
      {
        id: "addr1",
        type: "Home",
        street: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "United States",
        isDefault: true,
      },
      {
        id: "addr2",
        type: "Work",
        street: "456 Market Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
        country: "United States",
        isDefault: false,
      },
    ],
    paymentMethods: [
      {
        id: "pm1",
        type: "Credit Card",
        cardType: "Visa",
        lastFourDigits: "4242",
        expiryDate: "05/25",
        isDefault: true,
      },
      {
        id: "pm2",
        type: "Credit Card",
        cardType: "Mastercard",
        lastFourDigits: "5678",
        expiryDate: "08/24",
        isDefault: false,
      },
    ],
  })

  const [orders, setOrders] = useState([
    // {
    //   id: "ORD-12345",
    //   date: "2023-11-15",
    //   status: "Delivered",
    //   total: 129.99,
    //   items: [
    //     { id: "item1", name: "Wireless Headphones", quantity: 1, price: 79.99 },
    //     { id: "item2", name: "Phone Case", quantity: 1, price: 19.99 },
    //     { id: "item3", name: "USB-C Cable", quantity: 2, price: 14.99 },
    //   ],
    // },
    // {
    //   id: "ORD-12346",
    //   date: "2023-10-28",
    //   status: "Delivered",
    //   total: 249.99,
    //   items: [{ id: "item4", name: "Smart Watch", quantity: 1, price: 249.99 }],
    // },
    // {
    //   id: "ORD-12347",
    //   date: "2023-12-02",
    //   status: "Processing",
    //   total: 89.97,
    //   items: [
    //     { id: "item5", name: "Bluetooth Speaker", quantity: 1, price: 59.99 },
    //     { id: "item6", name: "Wireless Charger", quantity: 1, price: 29.98 },
    //   ],
    // },
  ])

  const [wishlist, setWishlist] = useState([
    // {
    //   id: "wl1",
    //   name: "Noise-Cancelling Headphones",
    //   price: 299.99,
    //   image: "/placeholder.svg?height=100&width=100",
    //   inStock: true,
    // },
    // {
    //   id: "wl2",
    //   name: "Smartphone Gimbal",
    //   price: 119.99,
    //   image: "/placeholder.svg?height=100&width=100",
    //   inStock: true,
    // },
    // {
    //   id: "wl3",
    //   name: "Mechanical Keyboard",
    //   price: 149.99,
    //   image: "/placeholder.svg?height=100&width=100",
    //   inStock: false,
    // },
    // {
    //   id: "wl4",
    //   name: "Ultra-wide Monitor",
    //   price: 499.99,
    //   image: "/placeholder.svg?height=100&width=100",
    //   inStock: true,
    // },
  ])

  const handleLogout = () => {
    alert("Logout functionality would go here")
  }

  const handleEditProfile = () => {
    alert("Edit profile functionality would go here")
  }

  return (
    <div>
      <Header />
    <div className="profile-container">
      <h1 className="profile-title">My Account</h1>
      <div className="profile-actions">
        <button className="btn btn-edit" onClick={handleEditProfile}>
          Edit Profile
        </button>
        <button className="btn btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="profile-grid">
        <ProfileHeader user={user} />
        <AddressPayment user={user} />
        <OrderHistory orders={orders} />
        <Wishlist items={wishlist} />
        </div>
      </div>
    <Footer />
    </div>
  )
}
