"use client"
import { useState, useEffect } from "react"
import "../styles/ProductDetailPage.css"
import Header from "../components/Header"
import Footer from "../components/Footer"
import FeatureSection from "../components/Featuresection"
import WhyUs from "../components/WhyUs"
// Mock data for the product
const productData = {
  id: 1,
  name: "Shanaya Premium Quality Concentrated Attar Perfume",
  price: 899,
  originalPrice: 1299,
  discount: "30% OFF",
  rating: 4.8,
  reviewCount: 124,
  description:
    "Experience the luxurious fragrance of Shanaya Premium Attar. This concentrated perfume offers a long-lasting exotic scent that combines floral and woody notes for a unique signature fragrance.",
  features: [
    "Premium quality concentrated attar",
    "Long-lasting fragrance (8-10 hours)",
    "Alcohol-free formula",
    "Suitable for all occasions",
    "Handcrafted with natural ingredients",
  ],
  images: [
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
    "/placeholder.svg?height=600&width=600",
  ],
  variants: [
    { id: 1, name: "10ml", price: 899, inStock: true },
    { id: 2, name: "20ml", price: 1599, inStock: true },
    { id: 3, name: "30ml", price: 2299, inStock: false },
  ],
  reviews: [
    {
      id: 1,
      user: "Rahul S.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Amazing fragrance that lasts all day. Definitely worth the price!",
    },
    {
      id: 2,
      user: "Priya M.",
      rating: 4,
      date: "1 month ago",
      comment: "Beautiful scent, but I wish it lasted a bit longer. Still very happy with my purchase.",
    },
    {
      id: 3,
      user: "Ahmed K.",
      rating: 5,
      date: "2 months ago",
      comment: "This is my third bottle. The fragrance is unique and I get compliments every time I wear it.",
    },
    {
      id: 4,
      user: "Sneha R.",
      rating: 5,
      date: "3 months ago",
      comment: "Absolutely love this attar! The scent is divine and lasts for hours.",
    },
  ],
  relatedProducts: [
    { id: 101, name: "Royal Oud Attar", price: 999, rating: 4.7, image: "/placeholder.svg?height=300&width=300" },
    { id: 102, name: "Musk Amber Perfume", price: 799, rating: 4.5, image: "/placeholder.svg?height=300&width=300" },
    { id: 103, name: "Jasmine Attar", price: 699, rating: 4.6, image: "/placeholder.svg?height=300&width=300" },
    { id: 104, name: "Sandalwood Premium", price: 1099, rating: 4.9, image: "/placeholder.svg?height=300&width=300" },
  ],
}

const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="star filled">
            ★
          </span>,
        )
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="star half-filled">
            ★
          </span>,
        )
      } else {
        stars.push(
          <span key={i} className="star">
            ☆
          </span>,
        )
      }
    }
    return stars
  }

  return (
    <div>
      <Header />
    <div className="product-detail-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <span>Home</span> / <span>Attar</span> / <span className="current">{productData.name}</span>
      </div>

      {/* Product Main Section */}
      <div className="product-main">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={productData.images[selectedImage] || "/placeholder.svg"} alt={productData.name} />
          </div>
          <div className="thumbnail-container">
            {productData.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={image || "/placeholder.svg"} alt={`${productData.name} - view ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{productData.name}</h1>

          <div className="product-rating">
            <div className="stars">{renderStars(productData.rating)}</div>
            <span className="rating-value">{productData.rating}</span>
            <span className="review-count">({productData.reviewCount} Reviews)</span>
          </div>

          <div className="product-price">
            <span className="current-price">₹{productData.variants[selectedVariant].price}</span>
            {productData.originalPrice && (
              <>
                <span className="original-price">₹{productData.originalPrice}</span>
                <span className="discount">{productData.discount}</span>
              </>
            )}
          </div>

          <div className="product-variants">
            <h3>Size Options:</h3>
            <div className="variant-options">
              {productData.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  className={`variant-button ${selectedVariant === index ? "selected" : ""} ${!variant.inStock ? "out-of-stock" : ""}`}
                  onClick={() => variant.inStock && setSelectedVariant(index)}
                  disabled={!variant.inStock}
                >
                  {variant.name}
                  {!variant.inStock && <span className="out-of-stock-label">Out of Stock</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-selector">
            <h3>Quantity:</h3>
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} disabled={quantity >= 10}>
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button className="add-to-cart-btn">Add to Cart</button>
            <button className="buy-now-btn">Buy Now</button>
            <button className="wishlist-btn">♡</button>
          </div>
        </div>
      </div>
      <FeatureSection />
      {/* Product Details Tabs */}
      <div className="product-details">
        <div className="tabs">
          <button className={activeTab === "description" ? "active" : ""} onClick={() => setActiveTab("description")}>
            Description
          </button>
          <button className={activeTab === "features" ? "active" : ""} onClick={() => setActiveTab("features")}>
            Features
          </button>
          <button className={activeTab === "reviews" ? "active" : ""} onClick={() => setActiveTab("reviews")}>
            Reviews ({productData.reviewCount})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <div className="description">
              <p>{productData.description}</p>
            </div>
          )}

          {activeTab === "features" && (
            <div className="features">
              <ul>
                {productData.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="reviews">
              <div className="review-summary">
                <div className="average-rating">
                  <h3>{productData.rating}</h3>
                  <div className="stars">{renderStars(productData.rating)}</div>
                  <p>{productData.reviewCount} Reviews</p>
                </div>
                <div className="rating-breakdown">
                  <div className="rating-bar">
                    <span>5 ★</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "80%" }}></div>
                    </div>
                    <span>80%</span>
                  </div>
                  <div className="rating-bar">
                    <span>4 ★</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "15%" }}></div>
                    </div>
                    <span>15%</span>
                  </div>
                  <div className="rating-bar">
                    <span>3 ★</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "5%" }}></div>
                    </div>
                    <span>5%</span>
                  </div>
                  <div className="rating-bar">
                    <span>2 ★</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "0%" }}></div>
                    </div>
                    <span>0%</span>
                  </div>
                  <div className="rating-bar">
                    <span>1 ★</span>
                    <div className="bar">
                      <div className="fill" style={{ width: "0%" }}></div>
                    </div>
                    <span>0%</span>
                  </div>
                </div>
              </div>

              <div className="review-list">
                {productData.reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <h4>{review.user}</h4>
                      <div className="review-stars">{renderStars(review.rating)}</div>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>

              <button className="write-review-btn">Write a Review</button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="related-products">
        <h2>You May Also Like</h2>
        <div className="product-grid">
          {productData.relatedProducts.map((product) => (
            <div key={product.id} className="related-product-card">
              <div className="product-image">
                <img src={product.image || "/placeholder.svg"} alt={product.name} />
              </div>
              <h3>{product.name}</h3>
              <div className="product-rating small">
                {renderStars(product.rating)}
                <span>{product.rating}</span>
              </div>
              <div className="product-price">₹{product.price}</div>
              <button className="quick-add-btn">Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <WhyUs />
      <Footer />
    </div>
  )
}

export default ProductDetailPage

