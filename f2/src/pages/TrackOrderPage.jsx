import { Layout, Typography, Input, Button, Steps, Card, Divider, List, Space } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const { Content } = Layout
const { Title, Text } = Typography
const { Step } = Steps

const TrackOrderPage = () => {
  const [orderNumber, setOrderNumber] = useState("")
  const [orderFound, setOrderFound] = useState(false)

  // Sample order data
  const orderDetails = {
    id: "ORD-12345",
    date: "March 15, 2023",
    status: "Shipped",
    customer: "Rahul Sharma",
    address: "123 Main St, Mumbai, Maharashtra, 400001",
    items: [
      { id: 1, name: "Royal Attar Perfume", price: 899, quantity: 2, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Oud Bakhoor", price: 699, quantity: 1, image: "/placeholder.svg?height=80&width=80" },
    ],
    total: 2499,
    currentStep: 2, // 0: Pending, 1: Processing, 2: Shipped, 3: Delivered
  }

  const handleSearch = () => {
    // In a real app, you would fetch the order details from an API
    if (orderNumber === "ORD-12345") {
      setOrderFound(true)
    } else {
      setOrderFound(false)
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "50px", background: "#f9f9f0" }}>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "2px" }}>
          <Title level={2}>Track Your Order</Title>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ display: "flex", marginBottom: "30px" }}>
              <Input
                placeholder="Enter your order number (e.g., ORD-12345)"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                style={{ marginRight: "10px" }}
                onPressEnter={handleSearch}
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                Track
              </Button>
            </div>

            {orderFound ? (
              <div>
                <Card title={`Order ${orderDetails.id}`} style={{ marginBottom: "20px" }}>
                  <div style={{ marginBottom: "20px" }}>
                    <Text strong>Date: </Text>
                    <Text>{orderDetails.date}</Text>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <Text strong>Shipping Address: </Text>
                    <Text>{orderDetails.address}</Text>
                  </div>
                  <div>
                    <Text strong>Total: </Text>
                    <Text>₹{orderDetails.total}</Text>
                  </div>
                </Card>

                <Card title="Order Status" style={{ marginBottom: "20px" }}>
                  <Steps current={orderDetails.currentStep}>
                    <Step title="Order Placed" description="March 15, 2023" />
                    <Step title="Processing" description="March 16, 2023" />
                    <Step title="Shipped" description="March 17, 2023" />
                    <Step title="Delivered" description="Expected by March 20, 2023" />
                  </Steps>
                </Card>

                <Card title="Order Items">
                  <List
                    itemLayout="horizontal"
                    dataSource={orderDetails.items}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<img src={item.image} alt={item.name} style={{ width: 80 }} />}
                          title={item.name}
                          description={`Quantity: ${item.quantity}`}
                        />
                        <div>₹{item.price * item.quantity}</div>
                      </List.Item>
                    )}
                  />
                </Card>
              </div>
            ) : orderNumber ? (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <Title level={4} style={{ color: "#ff4d4f" }}>
                  Order not found
                </Title>
                <Text>Please check your order number and try again.</Text>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "30px" }}>
                <Title level={4}>Enter your order number to track your order</Title>
                <Text>You can find your order number in your order confirmation email.</Text>
              </div>
            )}
          </div>
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}

export default TrackOrderPage