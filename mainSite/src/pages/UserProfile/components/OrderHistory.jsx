"use client"

import { useState } from "react"
import "../../../styles/OrderHistory.css"

export default function OrderHistory({ orders }) {
  const [expandedOrder, setExpandedOrder] = useState(null)

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null)
    } else {
      setExpandedOrder(orderId)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="profile-card order-history-card">
      <h2>Order History</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-orders">You haven't placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-header" onClick={() => toggleOrderDetails(order.id)}>
                <div className="order-header-details">
                  <div className="order-id">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value">{order.id}</span>
                  </div>
                  <div className="order-date">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{formatDate(order.date)}</span>
                  </div>
                </div>
                <div className="order-header-status">
                  <div className={`order-status status-${order.status.toLowerCase()}`}>{order.status}</div>
                  <div className="order-total">
                    <span className="detail-label">Total:</span>
                    <span className="detail-value">${order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="expand-icon">{expandedOrder === order.id ? "−" : "+"}</div>
              </div>

              {expandedOrder === order.id && (
                <div className="order-details">
                  <h4>Items</h4>
                  <div className="order-items">
                    {order.items.map((item) => (
                      <div key={item.id} className="order-item-detail">
                        <span className="item-name">{item.name}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                        <span className="item-price">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-actions">
                    <button className="btn-small">Track Order</button>
                    <button className="btn-small">View Invoice</button>
                    <button className="btn-small">Buy Again</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="view-all-orders">
        <button className="btn-link">View All Orders</button>
      </div>
    </div>
  )
}
