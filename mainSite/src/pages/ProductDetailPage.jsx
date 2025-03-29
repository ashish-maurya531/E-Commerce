"use client"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ProductCard from "../pages/ProductsPage/ProductCard"
import WhyUs from "../components/WhyUs"
import Header from "../components/Header"
import Footer from "../components/Footer"
import FeatureSection from "../components/Featuresection.jsx"
import products from '../../products.json' with { type: 'json' };
import "../styles/ProductDetailPage.css"
import { useLocation } from "react-router-dom";

// Reusable function to render stars
const renderStars = (rating) => {
  const stars = []
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>,
    )
  }
  return stars
}

const ProductDetailPage = () => {
  const { location } = useLocation();
  const { productId } = useParams()
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [mainImage, setMainImage] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + amount)))
  }
  const placeholderImage = "https://picsum.photos/300/300";
  // Sample data

  if (!products || products.length === 0) {
    return <h2 className="loading">Loading...</h2>
  }

  const product = products.find((product) => product.id == productId)

  if (!product) {
    return <h2 className="not-found">Product not found</h2>
  }

  const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div>
      <Header />
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span>Home</span> / <span>Products</span> / <span>{product.category}</span> / <span>{product.name}</span>
      </div>

      <div className="product-main-section">
        {/* Product Images */}
        <div className="product-images">
          <div className="main-image">
            <img src={product.images[mainImage] || "https://picsum.photos/600/600"} alt={product.name} />
          </div>
          <div className="image-thumbnails">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`thumbnail ${mainImage === index ? "active" : ""}`}
                onClick={() => setMainImage(index)}
              >
                <img src={image || "https://picsum.photos/100/100"} alt={`${product.name} - View ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-rating">
            <div className="stars">{renderStars(Math.floor(product.rating))}</div>
            <span className="rating-value">{product.rating}</span>
            <span className="review-count">({product.reviews.length} Reviews)</span>
          </div>

          <div className="product-price">
            <span className="current-price">₹{product.price}</span>
            {product.originalPrice && (
              <>
                <span className="original-price">₹{product.originalPrice}</span>
                <span className="discount-badge">{discountPercentage}% OFF</span>
              </>
            )}
          </div>

          <div className="product-short-description">{product.shortDescription}</div>

          {/* Product Variants */}
          {product.variants && (
            <ProductVariants
              variants={product.variants}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
            />
          )}

          {/* Quantity Selector */}
          <QuantitySelector quantity={quantity} onChange={handleQuantityChange} />

          {/* Actions */}
          <div className="product-actions">
            <button className="add-to-cart-btn">Add to Cart</button>
            <button className="buy-now-btn">Buy Now</button>
            <button className="wishlist-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          {/* Delivery Options */}
          <div className="delivery-options">
            <div className="delivery-check">
              <input type="text" placeholder="Enter pincode to check delivery" />
              <button>Check</button>
            </div>
            <div className="delivery-info">
              <div className="delivery-item">
                <span className="icon">🚚</span>
                <span>Free shipping on orders above ₹499</span>
              </div>
              <div className="delivery-item">
                <span className="icon">⏱️</span>
                <span>Delivery within 5-7 business days</span>
              </div>
            </div>
          </div>

          {/* Product Features */}
          <div className="product-highlights">
            <h3>Highlights</h3>
            <div className="highlights-grid">
              {product.features.map((feature, index) => (
                <div key={index} className="highlight-item">
                  <div className="highlight-icon">{feature.icon}</div>
                  <div className="highlight-content">
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="product-details">
        <div className="tabs">
          {["description", "specifications", "how-to-use", "reviews"].map((tab) => (
            <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
              {tab === "how-to-use" ? "How to Use" : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "description" && (
            <div className="description-content" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
          )}

          {activeTab === "specifications" && (
            <div className="specifications-content">
              <table className="specs-table">
                <tbody>
                  {product.specifications.map((spec, index) => (
                    <tr key={index}>
                      <th>{spec.name}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "how-to-use" && (
            <div className="how-to-use-content">
              <h3>How to Apply</h3>
              <p>{product.howToUse}</p>
              <div className="usage-tips">
                <h4>Pro Tips:</h4>
                <ul>
                  <li>For a subtle scent, apply to clothing instead of directly on skin</li>
                  <li>Layer with complementary fragrances for a unique signature scent</li>
                  <li>Store in a cool, dry place away from direct sunlight to preserve fragrance</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "reviews" && <ProductReviews reviews={product.reviews} rating={product.rating} />}
        </div>
      </div>

      <FeatureSection />

      {/* Related Products */}
      {product.relatedProducts && <RelatedProducts relatedProducts={product.relatedProducts} />}

      {/* Trust Badges */}
      <div className="trust-badges">
        <div className="badge">
          <div className="badge-icon">🚚</div>
          <div className="badge-text">Free Shipping</div>
        </div>
        <div className="badge">
          <div className="badge-icon">🔄</div>
          <div className="badge-text">Easy Returns</div>
        </div>
        <div className="badge">
          <div className="badge-icon">💰</div>
          <div className="badge-text">COD Available</div>
        </div>
        <div className="badge">
          <div className="badge-icon">🔒</div>
          <div className="badge-text">Secure Payments</div>
        </div>
      </div>
     </div>
     <WhyUs />
     <Footer />
    </div>
  )
}

// Product Variants Component
const ProductVariants = ({ variants, selectedVariant, setSelectedVariant }) => (
  <div className="product-variants">
    <h3>Size Options:</h3>
    <div className="variant-options">
      {variants.map((variant, index) => (
        <button
          key={variant.id}
          className={`variant-button ${selectedVariant === index ? "selected" : ""} ${!variant.inStock ? "out-of-stock" : ""}`}
          onClick={() => variant.inStock && setSelectedVariant(index)}
          disabled={!variant.inStock}
        >
          {variant.name} {!variant.inStock && <span className="out-of-stock-label">Out of Stock</span>}
        </button>
      ))}
    </div>
  </div>
)

// Quantity Selector Component
const QuantitySelector = ({ quantity, onChange }) => (
  <div className="quantity-selector">
    <h3>Quantity:</h3>
    <div className="quantity-controls">
      <button onClick={() => onChange(-1)} disabled={quantity <= 1}>
        -
      </button>
      <span>{quantity}</span>
      <button onClick={() => onChange(1)} disabled={quantity >= 10}>
        +
      </button>
    </div>
  </div>
)

// Product Reviews Component
const ProductReviews = ({ reviews, rating }) => (
  <div className="reviews">
    <div className="review-summary">
      <h3>{rating}</h3>
      <div className="stars">{renderStars(Math.floor(rating))}</div>
      <p>{reviews.length} Reviews</p>
    </div>
    <div className="review-list">
      {reviews.map((review) => (
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
)

// Related Products Component
const RelatedProducts = ({ relatedProducts }) => (
  <div className="related-products">
    <h2>You May Also Like</h2>
    <div className="product-grid">
      {relatedProducts.map((product) => (
        <ProductCard key={product.id} product={product} onClick={() => { navigate(`#`)}}/>
      ))}
    </div>
  </div>
)

export default ProductDetailPage

