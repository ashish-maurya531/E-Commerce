import { Layout, Carousel, Card, Row, Col, Typography, Button, Rate } from "antd"
import { ShoppingOutlined } from "@ant-design/icons"
import Header from "../components/Header"
import Footer from "../components/Footer"
import WhyUs from "../components/WhyUs"
const { Content } = Layout
const { Title, Text } = Typography
const { Meta } = Card

const HomePage = () => {
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
  {/* Hero Carousel */}
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
</Content>

      <WhyUs/>
      <Footer />
    </Layout>
  )
}

export default HomePage

