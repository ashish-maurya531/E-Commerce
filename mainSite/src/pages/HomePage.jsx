import {
  Layout,
  Carousel,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Rate,
} from "antd";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingOutlined } from "@ant-design/icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WhyUs from "../components/WhyUs";
import { useCart } from "../CartContext.jsx";
import ProductCard from "./ProductsPage/ProductCard.jsx";
import Featuresection from "../components/Featuresection.jsx";
const { Content } = Layout;
const { Title, Text } = Typography;
const { Meta } = Card;

const HomePage = () => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [featureFiltered, setFeatured] = useState([]);
  const [newFiltered, setNew] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const placeholderCategory = "https://picsum.photos/200/200";
  const categories = [
    {
      title: "General Health & Wellness",
      description: "Overall body wellness and energy boosters",
      image: placeholderCategory,
    },
    {
      title: "Digestive & Gut Health",
      description: "Improves digestion and gut health",
      image: placeholderCategory,
    },
    {
      title: "Liver & Kidney Health",
      description: "Supports liver and kidney function",
      image: placeholderCategory,
    },
    {
      title: "Men's Health",
      description: "Boosts stamina and reproductive health",
      image: placeholderCategory,
    },
    {
      title: "Women's Health",
      description: "Supports hormone balance and fertility",
      image: placeholderCategory,
    },
    {
      title: "Joint & Bone Health",
      description: "Strengthens bones and joints",
      image: placeholderCategory,
    },
    {
      title: "Skin & Hair Care",
      description: "For healthy skin and hair",
      image: placeholderCategory,
    },
    {
      title: "Immunity & Respiratory Health",
      description: "Supports immune and respiratory function",
      image: placeholderCategory,
    },
    {
      title: "Eye & Vision Care",
      description: "Improves vision and relieves eye discomfort",
      image: placeholderCategory,
    },
  ];
  const [expanded, setExpanded] = useState(false);
  const visibleCategories = expanded ? categories : categories.slice(0, 4);
  // Sample product data
  const placeholderImage = "https://picsum.photos/300/300";
  const featuredProducts = [
    {
      id: 13,
      name: "Blood Purifier",
      price: 499,
      image: placeholderImage,
      category: "Skin & Hair Care",
    },
    {
      id: 14,
      name: "Cyst Care",
      price: 749,
      image: placeholderImage,
      category: "Women's Health",
    },
    {
      id: 15,
      name: "Digestive Care Tablets",
      price: 399,
      image: placeholderImage,
      category: "Digestive & Gut Health",
    },
    {
      id: 16,
      name: "Charam Rog Nashak Malham",
      price: 599,
      image: placeholderImage,
      category: "Skin & Hair Care",
    },
  ];
  const newArrivals = [
    {
      id: 1,
      name: "Super Health",
      price: 499,
      image: placeholderImage,
      category: "General Health & Wellness",
    },
    {
      id: 2,
      name: "Liver Care",
      price: 599,
      image: placeholderImage,
      category: "Liver & Kidney Health",
    },
    {
      id: 3,
      name: "Total Health",
      price: 699,
      image: placeholderImage,
      category: "General Health & Wellness",
    },
    {
      id: 4,
      name: "Acai Berry",
      price: 799,
      image: placeholderImage,
      category: "Immunity & Respiratory Health",
    },
  ];
  const fetchFeaturedProducts = async () => {
    setLoading(true);
    try {
      // Simulating a product fetch or filtering
      const data = featuredProducts.map((product, index) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: Math.round(product.price * 1.5),
        discount: `${Math.round(
          (1 - product.price / (product.price * 1.5)) * 100
        )}% off`,
        image: product.image,
        rating: (Math.random() * 1.5 + 4).toFixed(1),
        reviews: Math.floor(Math.random() * 200) + 50,
        category: product.category
          .toLowerCase()
          .replace(/ & /g, "-")
          .replace(/\s+/g, "-"),
        isNew: Math.random() > 0.5,
      }));
      setFeatured(data); // Ensure this updates correctly
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchNewProducts = async () => {
    setLoading(true);
    try {
      // Simulating a product fetch or filtering
      const data = newArrivals.map((product, index) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: Math.round(product.price * 1.5),
        discount: `${Math.round(
          (1 - product.price / (product.price * 1.5)) * 100
        )}% off`,
        image: product.image,
        rating: (Math.random() * 1.5 + 4).toFixed(1),
        reviews: Math.floor(Math.random() * 200) + 50,
        category: product.category
          .toLowerCase()
          .replace(/ & /g, "-")
          .replace(/\s+/g, "-"),
        isNew: Math.random() > 0.5,
      }));
      setNew(data); // Ensure this updates correctly
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);
  useEffect(() => {
    fetchNewProducts();
  }, []);
  return (
    <Layout style={{ minHeight: "100vh", background: "#f9f9f0" }}>
      <Header />
      <Content>
        <Carousel
          autoplay
          autoplaySpeed={4000}
          pauseOnHover={false}
          effect="fade"
        >
          <div>
            <div
              style={{
                height: "500px",
                background:
                  "url(https://images.unsplash.com/photo-1514733670139-4d87a1941d55) center center no-repeat",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "white",
                textAlign: "center",
                transition: "all 0.8s ease-in-out", // Smooth transition
                opacity: "0.99",
              }}
            >
              <Title
                level={1}
                style={{
                  color: "white",
                  textShadow: "3px 3px 12px rgba(0, 0, 0, 1)", // Deep shadow for visibility
                  transform: "scale(1)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                Ancient Wisdom, Modern Wellness
              </Title>

              <Text
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginBottom: "20px",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 1)", // Shadow for readability
                  transition:
                    "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                  opacity: "0.9",
                }}
              >
                Handcrafted Herbal Products for a Healthier You.
              </Text>
              <Button
                type="primary"
                size="large"
                style={{
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Shop Now
              </Button>
            </div>
          </div>

          <div>
            <div
              style={{
                height: "500px",
                background:
                  "url(https://images.unsplash.com/photo-1492552181161-62217fc3076d) center center no-repeat",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "white",
                textAlign: "center",
                transition: "all 0.8s ease-in-out", // Smooth transition
                opacity: "0.9",
              }}
            >
              <Title
                level={1}
                style={{
                  color: "white",
                  textShadow: "3px 3px 12px rgba(0, 0, 0, 1)", // Deep shadow for visibility
                  transform: "scale(1)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                Harnessing the Power of Herbs
              </Title>

              <Text
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginBottom: "20px",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 1)", // Shadow for readability
                  transition:
                    "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                  opacity: "0.9",
                }}
              >
                Shop Ayurvedic & Herbal Products for a Balanced Life.
              </Text>
              <Button
                type="primary"
                size="large"
                style={{
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Shop Now
              </Button>
            </div>
          </div>

          <div>
            <div
              style={{
                height: "500px",
                background:
                  "url(https://images.unsplash.com/photo-1478744919174-118dbd24973e) center center no-repeat",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "white",
                textAlign: "center",
                transition: "all 0.8s ease-in-out",
                opacity: "0.9",
              }}
            >
              <Title
                level={1}
                style={{
                  color: "white",
                  textShadow: "3px 3px 12px rgba(0, 0, 0, 1)", // Deep shadow for visibility
                  transform: "scale(1)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                Nature’s Best, Delivered to You
              </Title>

              <Text
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginBottom: "20px",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 1)", // Shadow for readability
                  transition:
                    "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                  opacity: "0.9",
                }}
              >
                Pure. Organic. Wellness in Every Drop.
              </Text>
              <Button
                type="primary"
                size="large"
                style={{
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Shop Now
              </Button>
            </div>
          </div>

          <div>
            <div
              style={{
                height: "500px",
                background:
                  "url(https://images.unsplash.com/photo-1532092367580-3bd5bc78dd9d) center center no-repeat",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "white",
                textAlign: "center",
                transition: "all 0.8s ease-in-out",
                opacity: "0.99",
              }}
            >
              <Title
                level={1}
                style={{
                  color: "white",
                  textShadow: "3px 3px 12px rgba(0, 0, 0, 1)", // Deep shadow for visibility
                  transform: "scale(1)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                Herbal Healing, Naturally
              </Title>

              <Text
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginBottom: "20px",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 1)", // Shadow for readability
                  transition:
                    "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                  opacity: "0.9",
                }}
              >
                From Nature’s Lap to Your Home.
              </Text>
              <Button
                type="primary"
                size="large"
                style={{
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Shop Now
              </Button>
            </div>
          </div>

          <div>
            <div
              style={{
                height: "500px",
                background:
                  "url(https://images.unsplash.com/photo-1626788219759-3f2f7435a6d7) center center no-repeat",
                backgroundSize: "cover",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: "white",
                textAlign: "center",
                transition: "all 0.8s ease-in-out",
                opacity: "0.9",
              }}
            >
              <Title
                level={1}
                style={{
                  color: "white",
                  textShadow: "3px 3px 12px rgba(0, 0, 0, 1)", // Deep shadow for visibility
                  transform: "scale(1)",
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                Nourish Your Body the Natural Way
              </Title>

              <Text
                style={{
                  color: "white",
                  fontSize: "18px",
                  marginBottom: "20px",
                  textShadow: "2px 2px 10px rgba(0, 0, 0, 0.9)", // Shadow for readability
                  transition:
                    "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                  opacity: "0.9",
                }}
              >
                Organic Ingredients, Proven Results.
              </Text>

              <Button
                type="primary"
                size="large"
                style={{
                  transition: "all 0.3s ease",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                Shop Now
              </Button>
            </div>
          </div>
        </Carousel>
        <Featuresection />
        {/* Featured Categories */}
        <div style={{ padding: "60px 50px", background: "#fff" }}>
          <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
            Our Categories
          </h2>

          <Row gutter={[24, 24]}>
            {visibleCategories.map((category, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Card
                  onClick={() => navigate("/category/" + category.title)}
                  hoverable
                  cover={<img alt={category.title} src={category.image} />}
                  style={{ textAlign: "center" }}
                >
                  <Meta
                    title={category.title}
                    description={category.description}
                  />
                </Card>
              </Col>
            ))}
          </Row>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button type="primary" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Collapse Categories" : "Browse More Categories"}
            </Button>
          </div>
        </div>

        {/* Featured Products */}
        <div style={{ padding: "60px 50px" }}>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "40px" }}
          >
            Featured Products
          </Title>

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="product-skeleton"></div>
              ))}
            </div>
          ) : featureFiltered.length > 0 ? (
            <div className="products-grid">
              {featureFiltered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="clear-button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Banner */}
        <div
          style={{
            padding: "100px 50px",
            background:
              "url(https://picsum.photos/1200/300) center center no-repeat",
            backgroundSize: "cover",
            position: "relative",
            textAlign: "center",
            borderRadius: "12px",
            overflow: "hidden",
            color: "white",
          }}
        >
          {/* Dark Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0, 0, 0, 0.25)", // Semi-transparent black
              backdropFilter: "blur(5px)",
              zIndex: 1,
            }}
          ></div>

          <div style={{ position: "relative", zIndex: 2 }}>
            <Title
              level={2}
              style={{
                color: "white",
                fontSize: "36px",
                fontWeight: "bold",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.6)",
                letterSpacing: "1px",
              }}
            >
              Special Offer
            </Title>

            <Text
              style={{
                color: "white",
                fontSize: "20px",
                display: "block",
                marginBottom: "20px",
                textShadow: "1px 1px 6px rgba(0, 0, 0, 0.5)",
              }}
            >
              Buy <b>3 products</b> at just <b>₹1899</b>. Limited time offer!
            </Text>

            <Button
              type="primary"
              size="large"
              style={{
                background: "#6e8efb",
                border: "none",
                fontSize: "18px",
                padding: "12px 24px",
                borderRadius: "8px",
                transition: "background 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Shop Now
            </Button>
          </div>
        </div>

        {/* New Arrivals */}
        <div style={{ padding: "60px 50px" }}>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "40px" }}
          >
            New Arrivals
          </Title>

        {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="product-skeleton"></div>
              ))}
            </div>
          ) : newFiltered.length > 0 ? (
            <div className="products-grid">
              {newFiltered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button className="clear-button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Testimonials */}
        <div style={{ padding: "60px 50px" }}>
          <Title
            level={2}
            style={{ textAlign: "center", marginBottom: "40px" }}
          >
            What Our Customers Say
          </Title>

          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card style={{ height: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Rate disabled defaultValue={5} />
                </div>
                <Text style={{ display: "block", marginBottom: "15px" }}>
                  "The Royal Attar Perfume is absolutely amazing! The fragrance
                  lasts all day and I've received so many compliments."
                </Text>
                <div style={{ textAlign: "right" }}>
                  <Text strong>- Rahul S.</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card style={{ height: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Rate disabled defaultValue={5} />
                </div>
                <Text style={{ display: "block", marginBottom: "15px" }}>
                  "I've been using UHI products for years and they never
                  disappoint. The quality is consistently excellent."
                </Text>
                <div style={{ textAlign: "right" }}>
                  <Text strong>- Priya M.</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card style={{ height: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Rate disabled defaultValue={5} />
                </div>
                <Text style={{ display: "block", marginBottom: "15px" }}>
                  "The Bakhoor collection is exceptional. The fragrances are
                  authentic and remind me of traditional Arabian scents."
                </Text>
                <div style={{ textAlign: "right" }}>
                  <Text strong>- Ahmed K.</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <WhyUs />
      <Footer />
    </Layout>
  );
};

export default HomePage;
