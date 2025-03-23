import { Layout, Carousel, Card, Row, Col, Typography, Button, Rate } from "antd"
import { ShoppingOutlined } from "@ant-design/icons"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WhyUs from "../components/WhyUs"
const { Content } = Layout
const { Title, Text } = Typography
const { Meta } = Card

const HomePage = () => {
  const categories = [
    {
      title: "Attar",
      description: "Traditional fragrances",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Perfume Spray",
      description: "Modern scents",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Royal Attar",
      description: "Premium collection",
      image: "/placeholder.svg?height=200&width=200",
    },
    {
      title: "Bakhoor",
      description: "Exotic fragrances",
      image: "/placeholder.svg?height=200&width=200",
    },
  ];
  // Sample product data
  const featuredProducts = [
    {
      id: 1,
      name: "Royal Attar Perfume",
      price: 899,
      image: "/placeholder.svg?height=300&width=300",
      category: "Royal Attar",
    },
    {
      id: 2,
      name: "Musk Attar",
      price: 699,
      image: "/placeholder.svg?height=300&width=300",
      category: "Attar",
    },
    {
      id: 3,
      name: "Rose Perfume Spray",
      price: 799,
      image: "/placeholder.svg?height=300&width=300",
      category: "Perfume Spray",
    },
    {
      id: 4,
      name: "Oud Bakhoor",
      price: 1299,
      image: "/placeholder.svg?height=300&width=300",
      category: "Bakhoor",
    },
  ]

  const newArrivals = [
    {
      id: 5,
      name: "Premium Diffuser Oil",
      price: 999,
      image: "/placeholder.svg?height=300&width=300",
      category: "Diffuser Oil",
    },
    {
      id: 6,
      name: "Luxury Body Spray",
      price: 599,
      image: "/placeholder.svg?height=300&width=300",
      category: "Body Spray",
    },
    {
      id: 7,
      name: "Sandalwood Incense Sticks",
      price: 399,
      image: "/placeholder.svg?height=300&width=300",
      category: "Incense Sticks",
    },
    {
      id: 8,
      name: "Special Edition Attar",
      price: 1499,
      image: "/placeholder.svg?height=300&width=300",
      category: "Attar",
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9f9f0" }}>
      <Header />

      <Content>
      <Carousel autoplay autoplaySpeed={3000} pauseOnHover={false} effect="fade">
    <div>
      <div
        style={{
          height: "500px",
          background: "url(/images/p2.avif) center center no-repeat",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "white",
          textAlign: "center",
          transition: "all 0.8s ease-in-out",         // Smooth transition
          opacity: "0.9",
        }}
      >
        <Title
          level={1}
          style={{ 
            color: "white", 
            transform: "scale(1)", 
            transition: "transform 0.5s ease-in-out"
          }}
        >
          Premium Attars & Perfumes Oh Yeah
        </Title>
        <Text
          style={{
            color: "white",
            fontSize: "18px",
            marginBottom: "20px",
            transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
            opacity: "0.9",
          }}
        >
          Discover the finest collection of traditional and modern fragrances
        </Text>
        <Button
          type="primary"
          size="large"
          style={{
            transition: "all 0.3s ease",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Shop Now
        </Button>
      </div>
    </div>

    <div>
      <div
        style={{
          height: "500px",
          background: "url(/images/p1.avif) center center no-repeat",
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
            transform: "scale(1)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          Premium Attars & Perfumes
        </Title>
        <Text
          style={{
            color: "white",
            fontSize: "18px",
            marginBottom: "20px",
            transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
            opacity: "0.9",
          }}
        >
          Discover the finest collection of traditional and modern fragrances
        </Text>
        <Button
          type="primary"
          size="large"
          style={{
            transition: "all 0.3s ease",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Shop Now
        </Button>
      </div>
    </div>

    <div>
      <div
        style={{
          height: "500px",
          background: "url(/images/s1.avif) center center no-repeat",
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
            transform: "scale(1)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          Premium Attars & Perfumes
        </Title>
        <Text
          style={{
            color: "white",
            fontSize: "18px",
            marginBottom: "20px",
            transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
            opacity: "0.9",
          }}
        >
          Discover the finest collection of traditional and modern fragrances
        </Text>
        <Button
          type="primary"
          size="large"
          style={{
            transition: "all 0.3s ease",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Shop Now
        </Button>
      </div>
    </div>
    
    <div>
      <div
        style={{
          height: "500px",
          background: "url(/images/s2.avif) center center no-repeat",
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
            transform: "scale(1)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          Premium Attars & Perfumes
        </Title>
        <Text
          style={{
            color: "white",
            fontSize: "18px",
            marginBottom: "20px",
            transition: "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
            opacity: "0.9",
          }}
        >
          Discover the finest collection of traditional and modern fragrances
        </Text>
        <Button
          type="primary"
          size="large"
          style={{
            transition: "all 0.3s ease",
            transform: "scale(1)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Shop Now
        </Button>
      </div>
    </div>
  </Carousel>

        {/* Featured Categories */}
        <div style={{ padding: "60px 50px", background: "#fff" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
        Our Categories
      </Title>

      <Row gutter={[24, 24]}>
        {categories.map((category, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<img alt={category.title} src={category.image} />}
              style={{ textAlign: "center" }}
            >
              <Meta title={category.title} description={category.description} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>

        {/* Featured Products */}
        <div style={{ padding: "60px 50px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
            Featured Products
          </Title>

          <Row gutter={[24, 24]}>
            {featuredProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image || "/placeholder.svg"} />}
                  actions={[
                    <Button type="primary" icon={<ShoppingOutlined />} key="add-to-cart">
                      Add to Cart
                    </Button>,
                  ]}
                >
                  <Meta
                    title={product.name}
                    description={
                      <div>
                        <Text type="secondary">{product.category}</Text>
                        <div>
                          <Text strong>₹{product.price}</Text>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Banner */}
        <div
          style={{
            padding: "80px 50px",
            background: "url(/placeholder.svg?height=300&width=1200) center center no-repeat",
            backgroundSize: "cover",
            textAlign: "center",
            color: "white",
          }}
        >
          <Title level={2} style={{ color: "white" }}>
            Special Offer
          </Title>
          <Text style={{ color: "white", fontSize: "18px", display: "block", marginBottom: "20px" }}>
            Buy 3 attars at just ₹899. Limited time offer!
          </Text>
          <Button type="primary" size="large">
            Shop Now
          </Button>
        </div>

        {/* New Arrivals */}
        <div style={{ padding: "60px 50px", background: "#fff" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
            New Arrivals
          </Title>

          <Row gutter={[24, 24]}>
            {newArrivals.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image || "/placeholder.svg"} />}
                  actions={[
                    <Button type="primary" icon={<ShoppingOutlined />} key="add-to-cart">
                      Add to Cart
                    </Button>,
                  ]}
                >
                  <Meta
                    title={product.name}
                    description={
                      <div>
                        <Text type="secondary">{product.category}</Text>
                        <div>
                          <Text strong>₹{product.price}</Text>
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Testimonials */}
        <div style={{ padding: "60px 50px" }}>
          <Title level={2} style={{ textAlign: "center", marginBottom: "40px" }}>
            What Our Customers Say
          </Title>

          <Row gutter={[24, 24]} justify="center">
            <Col xs={24} sm={12} md={8}>
              <Card style={{ height: "100%" }}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <Rate disabled defaultValue={5} />
                </div>
                <Text style={{ display: "block", marginBottom: "15px" }}>
                  "The Royal Attar Perfume is absolutely amazing! The fragrance lasts all day and I've received so many
                  compliments."
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
                  "I've been using UHI products for years and they never disappoint. The quality is consistently
                  excellent."
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
                  "The Bakhoor collection is exceptional. The fragrances are authentic and remind me of traditional
                  Arabian scents."
                </Text>
                <div style={{ textAlign: "right" }}>
                  <Text strong>- Ahmed K.</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <WhyUs/>
      <Footer />
    </Layout>
  )
}

export default HomePage

