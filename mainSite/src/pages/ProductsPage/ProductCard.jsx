"use client"

import { useNavigate } from "react-router-dom";
import { useState } from "react"
import "../../styles/ProductCard.css"
import { useCart } from "../../CartContext.jsx";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false)
  const { addToCart } = useCart();
  return (
    <div className="product-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    onClick={() => navigate(`/product/${product.id}`)}>
      {/* Product Image */}
      <div className="product-image-container">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className={isHovered ? "product-image zoomed" : "product-image"}
        />

        {/* New Tag */}
        {product.isNew && <div className="new-tag">New Arrival</div>}

        {/* Discount Tag */}
        {product.discount && <div className="discount-tag">{product.discount}</div>}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        {/* Rating */}
        <div className="product-rating">
          <span className="rating-star">★</span>
          <span className="rating-text">
            {product.rating} | {product.reviews}
          </span>
        </div>

        {/* Price */}
        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.originalPrice && <span className="original-price">₹{product.originalPrice}</span>}
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-cart-button"
        onClick={(e) => {
          e.stopPropagation();
          addToCart(product);
        }}
        >ADD TO CART</button>
      </div>
    </div>
  )
}

export default ProductCard

