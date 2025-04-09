// "use client"
// import { useState, useEffect } from "react"
// import { useParams } from "react-router-dom"
// import ProductCard from "../pages/ProductsPage/ProductCard"
// import WhyUs from "../components/WhyUs"
// import Header from "../components/Header"
// import Footer from "../components/Footer"
// import FeatureSection from "../components/Featuresection.jsx"
// import products from '../../products.json' with { type: 'json' };
// import "../styles/ProductDetailPage.css"
// import { useLocation } from "react-router-dom";

// // Reusable function to render stars
// const renderStars = (rating) => {
//   const stars = []
//   for (let i = 0; i < 5; i++) {
//     stars.push(
//       <span key={i} className={i < rating ? "star filled" : "star"}>
//         ★
//       </span>,
//     )
//   }
//   return stars
// }

// const ProductDetailPage = () => {
//   const { location } = useLocation();
//   const { productId } = useParams()
//   const [selectedVariant, setSelectedVariant] = useState(0)
//   const [quantity, setQuantity] = useState(1)
//   const [activeTab, setActiveTab] = useState("description")
//   const [mainImage, setMainImage] = useState(0)

//   useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [location])

//   const handleQuantityChange = (amount) => {
//     setQuantity((prev) => Math.max(1, Math.min(10, prev + amount)))
//   }
//   const placeholderImage = "https://picsum.photos/300/300";
//   // Sample data

//   if (!products || products.length === 0) {
//     return <h2 className="loading">Loading...</h2>
//   }

//   const product = products.find((product) => product.id == productId)

//   if (!product) {
//     return <h2 className="not-found">Product not found</h2>
//   }

//   const discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

//   return (
//     <div>
//       <Header />
//     <div className="product-detail-page">
//       {/* Breadcrumb */}
//       <div className="breadcrumb">
//         <span>Home</span> / <span>Products</span> / <span>{product.category}</span> / <span>{product.name}</span>
//       </div>

//       <div className="product-main-section">
//         {/* Product Images */}
//         <div className="product-images">
//           <div className="main-image">
//             <img src={product.images[mainImage] || "https://picsum.photos/600/600"} alt={product.name} />
//           </div>
//           <div className="image-thumbnails">
//             {product.images.map((image, index) => (
//               <div
//                 key={index}
//                 className={`thumbnail ${mainImage === index ? "active" : ""}`}
//                 onClick={() => setMainImage(index)}
//               >
//                 <img src={image || "https://picsum.photos/100/100"} alt={`${product.name} - View ${index + 1}`} />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="product-info">
//           <h1 className="product-title">{product.name}</h1>

//           <div className="product-rating">
//             <div className="stars">{renderStars(Math.floor(product.rating))}</div>
//             <span className="rating-value">{product.rating}</span>
//             <span className="review-count">({product.reviews.length} Reviews)</span>
//           </div>

//           <div className="product-price">
//             <span className="current-price">₹{product.price}</span>
//             {product.originalPrice && (
//               <>
//                 <span className="original-price">₹{product.originalPrice}</span>
//                 <span className="discount-badge">{discountPercentage}% OFF</span>
//               </>
//             )}
//           </div>

//           <div className="product-short-description">{product.shortDescription}</div>

//           {/* Product Variants */}
//           {product.variants && (
//             <ProductVariants
//               variants={product.variants}
//               selectedVariant={selectedVariant}
//               setSelectedVariant={setSelectedVariant}
//             />
//           )}

//           {/* Quantity Selector */}
//           <QuantitySelector quantity={quantity} onChange={handleQuantityChange} />

//           {/* Actions */}
//           <div className="product-actions">
//             <button className="add-to-cart-btn">Add to Cart</button>
//             <button className="buy-now-btn">Buy Now</button>
//             <button className="wishlist-btn">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
//               </svg>
//             </button>
//           </div>

//           {/* Delivery Options */}
//           <div className="delivery-options">
//             <div className="delivery-check">
//               <input type="text" placeholder="Enter pincode to check delivery" />
//               <button>Check</button>
//             </div>
//             <div className="delivery-info">
//               <div className="delivery-item">
//                 <span className="icon">🚚</span>
//                 <span>Free shipping on orders above ₹499</span>
//               </div>
//               <div className="delivery-item">
//                 <span className="icon">⏱️</span>
//                 <span>Delivery within 5-7 business days</span>
//               </div>
//             </div>
//           </div>

//           {/* Product Features */}
//           <div className="product-highlights">
//             <h3>Highlights</h3>
//             <div className="highlights-grid">
//               {product.features.map((feature, index) => (
//                 <div key={index} className="highlight-item">
//                   <div className="highlight-icon">{feature.icon}</div>
//                   <div className="highlight-content">
//                     <h4>{feature.title}</h4>
//                     <p>{feature.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Details Tabs */}
//       <div className="product-details">
//         <div className="tabs">
//           {["description", "specifications", "how-to-use", "reviews"].map((tab) => (
//             <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)}>
//               {tab === "how-to-use" ? "How to Use" : tab.charAt(0).toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//         </div>

//         <div className="tab-content">
//           {activeTab === "description" && (
//             <div className="description-content" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
//           )}

//           {activeTab === "specifications" && (
//             <div className="specifications-content">
//               <table className="specs-table">
//                 <tbody>
//                   {product.specifications.map((spec, index) => (
//                     <tr key={index}>
//                       <th>{spec.name}</th>
//                       <td>{spec.value}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {activeTab === "how-to-use" && (
//             <div className="how-to-use-content">
//               <h3>How to Apply</h3>
//               <p>{product.howToUse}</p>
//               <div className="usage-tips">
//                 <h4>Pro Tips:</h4>
//                 <ul>
//                   <li>For a subtle scent, apply to clothing instead of directly on skin</li>
//                   <li>Layer with complementary fragrances for a unique signature scent</li>
//                   <li>Store in a cool, dry place away from direct sunlight to preserve fragrance</li>
//                 </ul>
//               </div>
//             </div>
//           )}

//           {activeTab === "reviews" && <ProductReviews reviews={product.reviews} rating={product.rating} />}
//         </div>
//       </div>

//       <FeatureSection />

//       {/* Related Products */}
//       {product.relatedProducts && <RelatedProducts relatedProducts={product.relatedProducts} />}

//       {/* Trust Badges */}
//       <div className="trust-badges">
//         <div className="badge">
//           <div className="badge-icon">🚚</div>
//           <div className="badge-text">Free Shipping</div>
//         </div>
//         <div className="badge">
//           <div className="badge-icon">🔄</div>
//           <div className="badge-text">Easy Returns</div>
//         </div>
//         <div className="badge">
//           <div className="badge-icon">💰</div>
//           <div className="badge-text">COD Available</div>
//         </div>
//         <div className="badge">
//           <div className="badge-icon">🔒</div>
//           <div className="badge-text">Secure Payments</div>
//         </div>
//       </div>
//      </div>
//      <WhyUs />
//      <Footer />
//     </div>
//   )
// }

// // Product Variants Component
// const ProductVariants = ({ variants, selectedVariant, setSelectedVariant }) => (
//   <div className="product-variants">
//     <h3>Size Options:</h3>
//     <div className="variant-options">
//       {variants.map((variant, index) => (
//         <button
//           key={variant.id}
//           className={`variant-button ${selectedVariant === index ? "selected" : ""} ${!variant.inStock ? "out-of-stock" : ""}`}
//           onClick={() => variant.inStock && setSelectedVariant(index)}
//           disabled={!variant.inStock}
//         >
//           {variant.name} {!variant.inStock && <span className="out-of-stock-label">Out of Stock</span>}
//         </button>
//       ))}
//     </div>
//   </div>
// )

// // Quantity Selector Component
// const QuantitySelector = ({ quantity, onChange }) => (
//   <div className="quantity-selector">
//     <h3>Quantity:</h3>
//     <div className="quantity-controls">
//       <button onClick={() => onChange(-1)} disabled={quantity <= 1}>
//         -
//       </button>
//       <span>{quantity}</span>
//       <button onClick={() => onChange(1)} disabled={quantity >= 10}>
//         +
//       </button>
//     </div>
//   </div>
// )

// // Product Reviews Component
// const ProductReviews = ({ reviews, rating }) => (
//   <div className="reviews">
//     <div className="review-summary">
//       <h3>{rating}</h3>
//       <div className="stars">{renderStars(Math.floor(rating))}</div>
//       <p>{reviews.length} Reviews</p>
//     </div>
//     <div className="review-list">
//       {reviews.map((review) => (
//         <div key={review.id} className="review-item">
//           <div className="review-header">
//             <h4>{review.user}</h4>
//             <div className="review-stars">{renderStars(review.rating)}</div>
//             <span className="review-date">{review.date}</span>
//           </div>
//           <p className="review-comment">{review.comment}</p>
//         </div>
//       ))}
//     </div>
//     <button className="write-review-btn">Write a Review</button>
//   </div>
// )

// // Related Products Component
// const RelatedProducts = ({ relatedProducts }) => (
//   <div className="related-products">
//     <h2>You May Also Like</h2>
//     <div className="product-grid">
//       {relatedProducts.map((product) => (
//         <ProductCard key={product.id} product={product} onClick={() => { navigate(`#`)}}/>
//       ))}
//     </div>
//   </div>
// )

// export default ProductDetailPage

"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProductCard from "../pages/ProductsPage/ProductCard";
import WhyUs from "../components/WhyUs";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FeatureSection from "../components/Featuresection.jsx";
import "../styles/ProductDetailPage.css";
import axios from "axios";
import Loader from "../components/Loader.jsx";
const Src = import.meta.env.VITE_Src;

// Reusable function to render stars
const renderStars = (rating) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    );
  }
  return stars;
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState(0);

  const imageRef = useRef(null);
  const imageContainerRef = useRef(null);

  const handleZoom = (e) => {
    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
    imageRef.current.style.transform = "scale(1.8)";
  };

  const resetZoom = () => {
    imageRef.current.style.transform = "scale(1)";
    imageRef.current.style.transformOrigin = "center center";
  };
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Src}/api/products/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details. Please try again later.");
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [productId, location]);

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + amount)));
  };

  const handleAddToCart = () => {
    // Get current cart from local storage
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists in cart
    const existingItemIndex = currentCart.findIndex(
      (item) =>
        item.product_id === product.product_id &&
        (product.variants
          ? item.variant === product.variants[selectedVariant]?.name
          : true)
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      currentCart.push({
        product_id: product.product_id,
        name: product.name,
        price: product.price,
        original_price: product.original_price,
        image:
          product.images && product.images.length > 0
            ? product.images[0]
            : null,
        quantity: quantity,
        variant: product.variants
          ? product.variants[selectedVariant]?.name
          : null,
      });
    }

    // Save updated cart to local storage
    localStorage.setItem("cart", JSON.stringify(currentCart));

    // Provide feedback to user (you can replace this with your preferred method)
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };


  if (error) {
    return (
      <div>
        <Header />
        <div className="product-detail-page">
          <h2 className="error">{error}</h2>
        </div>
        <Footer />
      </div>
    );
  }

  while (!product) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const discountPercentage = product.discount_percentage
    ? parseFloat(product.discount_percentage)
    : product.original_price && product.price
    ? Math.round(
        ((parseFloat(product.original_price) - parseFloat(product.price)) /
          parseFloat(product.original_price)) *
          100
      )
    : 0;

  const productReviews = product?.reviews || [];
  const productFeatures = product?.features || [];
  const productSpecifications = product?.specifications || [];
  const relatedProducts = product?.related_products || [];

  return (
    <div>
      {loading && <Loader />}
      <Header />
      <div className="product-detail-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate("/")}>Home</span> /
          <span onClick={() => navigate("/products")}>Products</span> /
          <span>{product.category_id || "General"}</span> /
          <span>{product.name}</span>
        </div>

        <div className="product-main-section">
          {/* Product Images */}
          <div className="product-images">
            <div
              className="main-image"
              onMouseMove={handleZoom}
              onMouseLeave={resetZoom}
              ref={imageContainerRef}
            >
              <img
                ref={imageRef}
                src={
                  product.images && product.images.length > 0
                    ? `${Src}${product.images[mainImage]}`
                    : "https://picsum.photos/600/600"
                }
                alt={product.name}
                className="zoomable-image"
              />
            </div>

            <div className="image-thumbnails">
              {product.images &&
                product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      mainImage === index ? "active" : ""
                    }`}
                    onClick={() => setMainImage(index)}
                  >
                    <img
                      src={`${Src}${image}`}
                      alt={`${product.name} - View ${index + 1}`}
                    />
                  </div>
                ))}
            </div>
            {/* Product Features */}
            {productFeatures.length > 0 && (
              <div className="product-highlights">
                <h3>Highlights</h3>
                <div className="highlights-grid">
                  {productFeatures.map((feature, index) => (
                    <div key={index} className="highlight-item">
                      <div className="highlight-icon">
                        {feature.icon || "✓"}
                      </div>
                      <div className="highlight-content">
                        <h4>{feature.title}</h4>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <div className="stars">
                {renderStars(Math.floor(parseFloat(product.rating || 0)))}
              </div>
              <span className="rating-value">
                {product.rating || "No ratings"}
              </span>
              <span className="review-count">
                ({productReviews.length} Reviews)
              </span>
            </div>

            <div className="product-price">
              <span className="current-price">
                ₹{parseFloat(product.price).toFixed(2)}
              </span>
              {product.original_price &&
                parseFloat(product.original_price) >
                  parseFloat(product.price) && (
                  <>
                    <span className="original-price">
                      ₹{parseFloat(product.original_price).toFixed(2)}
                    </span>
                    <span className="discount-badge">
                      {discountPercentage}% OFF
                    </span>
                  </>
                )}
            </div>

            <div className="product-short-description">
              {product.short_description_en || product.description_en}
            </div>

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <ProductVariants
                variants={product.variants}
                selectedVariant={selectedVariant}
                setSelectedVariant={setSelectedVariant}
              />
            )}

            {/* Quantity Selector */}
            <QuantitySelector
              quantity={quantity}
              onChange={handleQuantityChange}
            />

            {/* Actions */}
            <div className="product-actions">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
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
                <input
                  type="text"
                  placeholder="Enter pincode to check delivery"
                />
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

            {/* Benefits Section */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="product-benefits">
                <h3>Benefits</h3>
                <ul className="benefits-list">
                  {product.benefits.map((benefit, index) => (
                    <li key={index}>{benefit.en}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="product-details">
          <div className="tabs">
            <button
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            {productSpecifications.length > 0 && (
              <button
                className={activeTab === "specifications" ? "active" : ""}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>
            )}
            {product.dosage_en && (
              <button
                className={activeTab === "how-to-use" ? "active" : ""}
                onClick={() => setActiveTab("how-to-use")}
              >
                How to Use
              </button>
            )}
            <button
              className={activeTab === "reviews" ? "active" : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "description" && (
              <div className="description-content">
                {product.description_en || "No detailed description available."}
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="specifications-content">
                <table className="specs-table">
                  <tbody>
                    {productSpecifications.map((spec, index) => (
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
                <h3>How to Use</h3>
                <p>{product.dosage_en || "No usage instructions available."}</p>
                <div className="usage-tips">
                  <h4>Pro Tips:</h4>
                  <ul>
                    <li>For best results, use as directed</li>
                    <li>
                      Store in a cool, dry place away from direct sunlight
                    </li>
                    <li>
                      Consult a healthcare professional before use if you have
                      any medical conditions
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <ProductReviews
                reviews={productReviews}
                rating={parseFloat(product.rating || 0)}
              />
            )}
          </div>
        </div>

        <FeatureSection />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts
            relatedProducts={relatedProducts}
            navigate={navigate}
          />
        )}

        {/* Trust Badges */}
        {/* <div className="trust-badges">
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
        </div> */}
      </div>
      <WhyUs />
      <Footer />
    </div>
  );
};

// Product Variants Component
const ProductVariants = ({ variants, selectedVariant, setSelectedVariant }) => (
  <div className="product-variants">
    <h3>Size Options:</h3>
    <div className="variant-options">
      {variants.map((variant, index) => (
        <button
          key={variant.id || index}
          className={`variant-button ${
            selectedVariant === index ? "selected" : ""
          } ${!variant.inStock ? "out-of-stock" : ""}`}
          onClick={() => variant.inStock !== false && setSelectedVariant(index)}
          disabled={variant.inStock === false}
        >
          {variant.name}{" "}
          {variant.inStock === false && (
            <span className="out-of-stock-label">Out of Stock</span>
          )}
        </button>
      ))}
    </div>
  </div>
);

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
);

// Product Reviews Component
const ProductReviews = ({ reviews, rating }) => {
  const reviewsToDisplay =
    reviews.length > 0
      ? reviews
      : [
          {
            id: 1,
            user: "Demo User",
            rating: 5,
            date: "2025-03-20",
            comment: "Great product! Highly recommended.",
          },
        ];

  return (
    <div className="reviews">
      <div className="review-summary">
        <h3>{rating.toFixed(1)}</h3>
        <div className="stars">{renderStars(Math.floor(rating))}</div>
        <p>{reviews.length} Reviews</p>
      </div>
      <div className="review-list">
        {reviewsToDisplay.map((review, index) => (
          <div key={review.id || index} className="review-item">
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
  );
};

// Related Products Component
const RelatedProducts = ({ relatedProducts, navigate }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        // Create an array of promises for each product fetch
        const productPromises = relatedProducts.map((product) =>
          axios.get(`${Src}/api/products/${product.product_id}`)
        );

        // Wait for all promises to resolve
        const responses = await Promise.all(productPromises);

        // Extract product data from responses
        const fetchedProducts = responses.map((response) => response.data);
        setProducts(fetchedProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching related products:", err);
        setLoading(false);
      }
    };

    if (relatedProducts.length > 0) {
      fetchRelatedProducts();
    } else {
      setLoading(false);
    }
  }, [relatedProducts]);

  if (loading) {
    return <div className="related-products">Loading related products...</div>;
  }

  if (products.length === 0) {
    return null;
  }
  
  return (
    <div className="related-products">
      <h2>You May Also Like</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.product_id}
            product={{
              id: product.product_id,
              name: product.name,
              price: product.price,
              originalPrice: product.original_price,
              rating: product.rating,
              image:
                product.images && product.images.length > 0
                  ? `${Src}${product.images[0]}`
                  : "https://picsum.photos/300/300",
            }}
            onClick={() => navigate(`/product/${product.product_id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductDetailPage;
