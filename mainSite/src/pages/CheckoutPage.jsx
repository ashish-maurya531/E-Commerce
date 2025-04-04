import { Layout, Typography, Steps, Form, Input, Button, Row, Col, Card, Divider, Radio, Space, List } from "antd"
import { useState,useEffect } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const { Content } = Layout
const { Title, Text } = Typography
const { Step } = Steps

const CheckoutPage = () => {
  const [current, setCurrent] = useState(0)

  const next = () => {
    setCurrent(current + 1)
  }

  const prev = () => {
    setCurrent(current - 1)
  }
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Sample cart items
  const cartItems = [
    {
      id: 1,
      name: "Aloe Vera Gel",
      price: 899,
      quantity: 2,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 99
  const total = subtotal + shipping

  const steps = [
    {
      title: "Shipping",
      content: (
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
                <Input placeholder="Enter your first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
                <Input placeholder="Enter your last name" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Input placeholder="Enter your address" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="City" name="city" rules={[{ required: true }]}>
                <Input placeholder="Enter your city" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="State" name="state" rules={[{ required: true }]}>
                <Input placeholder="Enter your state" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Pincode" name="pincode" rules={[{ required: true }]}>
                <Input placeholder="Enter your pincode" />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" onClick={next}>
            Continue to Payment
          </Button>
        </Form>
      ),
    },
    {
      title: "Payment",
      content: (
        <div>
          <Form layout="vertical">
            <Form.Item label="Payment Method" name="paymentMethod" rules={[{ required: true }]}>
              <Radio.Group>
                <Space direction="vertical">
                  <Radio value="cod">Cash on Delivery</Radio>
                  <Radio value="card">Credit/Debit Card</Radio>
                  <Radio value="upi">UPI</Radio>
                  <Radio value="netbanking">Net Banking</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
            <div style={{ marginTop: 24 }}>
              <Button style={{ marginRight: 8 }} onClick={prev}>
                Back
              </Button>
              <Button type="primary" onClick={next}>
                Continue to Review
              </Button>
            </div>
          </Form>
        </div>
      ),
    },
    {
      title: "Review",
      content: (
        <div>
          <Card title="Order Summary">
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
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
            <Divider />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Subtotal</Text>
              <Text>₹{subtotal}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
              <Text>Shipping</Text>
              <Text>₹{shipping}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
              <Text strong>Total</Text>
              <Text strong>₹{total}</Text>
            </div>
          </Card>
          <div style={{ marginTop: 24 }}>
            <Button style={{ marginRight: 8 }} onClick={prev}>
              Back
            </Button>
            <Button type="primary" onClick={next}>
              Place Order
            </Button>
          </div>
        </div>
      ),
    },
    {
      title: "Confirmation",
      content: (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: "64px", color: "#52c41a", marginBottom: "24px" }}>✓</div>
          <Title level={2}>Order Placed Successfully!</Title>
          <Text>Your order number is: #ORD-12350</Text>
          <p style={{ margin: "16px 0" }}>
            We've sent a confirmation email to your registered email address. You can also track your order status.
          </p>
          <Button type="primary" href="/track-order">
            Track Order
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "50px", background: "#f9f9f0" }}>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "2px" }}>
          <Title level={2}>Checkout</Title>
          <Steps current={current} style={{ marginBottom: "40px" }}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div>{steps[current].content}</div>
        </div>
      </Content>
      <Footer />
    </Layout>
  )
}

export default CheckoutPage