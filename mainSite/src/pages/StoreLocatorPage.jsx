import { Layout, Typography, Input, Button, Card, Row, Col, Divider, Tag } from "antd"
import { SearchOutlined, EnvironmentOutlined, PhoneOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { useState, useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const { Content } = Layout
const { Title, Text, Paragraph } = Typography

const StoreLocatorPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Sample store data
  const stores = [
    {
      id: 1,
      name: "AdilQadri Flagship Store",
      address: "123 Main Street, Bandra West, Mumbai, Maharashtra 400050",
      phone: "+91 9876543210",
      hours: "10:00 AM - 9:00 PM",
      days: "Monday - Sunday",
      features: ["Tester Counter", "Exclusive Products", "Expert Consultation"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "AdilQadri Premium Outlet",
      address: "456 Park Avenue, Connaught Place, New Delhi, Delhi 110001",
      phone: "+91 9876543211",
      hours: "11:00 AM - 8:00 PM",
      days: "Monday - Saturday",
      features: ["Tester Counter", "Gift Wrapping"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "AdilQadri Boutique",
      address: "789 MG Road, Koramangala, Bangalore, Karnataka 560034",
      phone: "+91 9876543212",
      hours: "10:30 AM - 8:30 PM",
      days: "Monday - Sunday",
      features: ["Exclusive Products", "Expert Consultation"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "AdilQadri Express Store",
      address: "101 Anna Salai, T. Nagar, Chennai, Tamil Nadu 600017",
      phone: "+91 9876543213",
      hours: "10:00 AM - 7:00 PM",
      days: "Monday - Saturday",
      features: ["Tester Counter"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  // Filter stores based on search query
  const filteredStores = searchQuery
    ? stores.filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stores

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "50px", background: "#f9f9f0" }}>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "2px" }}>
          <Title level={2}>Store Locator</Title>
          <Paragraph>
            Find AdilQadri stores near you. Visit us to experience our exclusive collection of attars, perfumes, and
            fragrances.
          </Paragraph>

          <div style={{ margin: "30px 0" }}>
            <Input
              placeholder="Search by city, area, or store name"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", maxWidth: "500px" }}
              size="large"
            />
          </div>

          <Row gutter={[24, 24]}>
            {filteredStores.map((store) => (
              <Col xs={24} sm={24} md={12} key={store.id}>
                <Card hoverable>
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <img
                        src={store.image}
                        alt={store.name}
                        style={{ width: "100%", height: "auto", borderRadius: "4px" }}
                      />
                    </Col>
                    <Col xs={24} md={16}>
                      <Title level={4}>{store.name}</Title>
                      <div style={{ marginBottom: "10px" }}>
                        <EnvironmentOutlined style={{ marginRight: "8px" }} />
                        <Text>{store.address}</Text>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <PhoneOutlined style={{ marginRight: "8px" }} />
                        <Text>{store.phone}</Text>
                      </div>
                      <div style={{ marginBottom: "10px" }}>
                        <ClockCircleOutlined style={{ marginRight: "8px" }} />
                        <Text>{store.hours}</Text>
                        <br />
                        <Text style={{ marginLeft: "24px" }}>{store.days}</Text>
                      </div>
                      <div>
                        {store.features.map((feature, index) => (
                          <Tag color="gold" key={index}>
                            {feature}
                          </Tag>
                        ))}
                      </div>
                      <div style={{ marginTop: "15px" }}>
                        <Button type="primary" href={`https://maps.google.com/?q=${store.address}`} target="_blank">
                          Get Directions
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>

          {filteredStores.length === 0 && (
            <div style={{ textAlign: "center", padding: "30px" }}>
              <Title level={4}>No stores found</Title>
              <Text>Try a different search term or browse all stores.</Text>
              <div style={{ marginTop: "15px" }}>
                <Button type="primary" onClick={() => setSearchQuery("")}>
                  View All Stores
                </Button>
              </div>
            </div>
          )}
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}

export default StoreLocatorPage