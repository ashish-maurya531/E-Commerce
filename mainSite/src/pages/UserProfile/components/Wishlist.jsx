import "../../../styles/Wishlist.css"

export default function Wishlist({ items }) {
  return (
    <div className="profile-card wishlist-card">
      <div className="wishlist-header">
        <h2>Wishlist</h2>
        <button className="btn-link">View All</button>
      </div>

      <div className="wishlist-items">
        {items.length === 0 ? (
          <p className="no-items">Your wishlist is empty.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="wishlist-item">
              <div className="wishlist-item-image">
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
              </div>
              <div className="wishlist-item-details">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-price">${item.price.toFixed(2)}</div>
                <div className={`item-stock ${item.inStock ? "in-stock" : "out-of-stock"}`}>
                  {item.inStock ? "In Stock" : "Out of Stock"}
                </div>
              </div>
              <div className="wishlist-item-actions">
                <button className="btn-small" disabled={!item.inStock}>
                  {item.inStock ? "Add to Cart" : "Notify Me"}
                </button>
                <button className="btn-small btn-danger">Remove</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
