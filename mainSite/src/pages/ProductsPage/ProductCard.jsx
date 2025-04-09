"use client";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/ProductCard.css";
import { useCart } from "../../CartContext.jsx";
import { ShoppingCartOutlined, ShareAltOutlined } from "@ant-design/icons";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Product Image */}
        <div className="product-image-container">
          <div className="icon-top-right">
          <ShareAltOutlined
          className="share-button"
          onClick={(e) => {
            e.stopPropagation();
            const shareUrl = `${window.location.origin}/product/${product.id}`;
            const shareData = {
              title: product.name,
              text: "Check out this product!",
              url: shareUrl,
            };

            if (navigator.share) {
              navigator
                .share(shareData)
                .catch((err) => console.error("Sharing failed:", err));
            } else {
              navigator.clipboard.writeText(shareUrl).then(() => {
                alert("Link copied to clipboard!");
              });
            }
          }}
        />
          </div>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className={isHovered ? "product-image zoomed" : "product-image"}
          />

          {/* New Tag */}
          {product.isNew && <div className="new-tag">New Arrival</div>}

          {/* Discount Tag */}
          {product.discount && (
            <div className="discount-tag">{product.discount}</div>
          )}
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
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
        </div>

        {/*Buttons*/}
        <div className="product-buttons">
          <ShoppingCartOutlined
            className="add-to-cart-button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          />
          <button className="buy-now-button">BUY NOW</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
