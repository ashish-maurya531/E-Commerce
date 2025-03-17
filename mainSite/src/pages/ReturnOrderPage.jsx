import { Layout, Typography, Form, Input, Button, Select, Upload, Card, Steps, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { useState } from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const { Content } = Layout
const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { Step } = Steps
const { TextArea } = Input

const ReturnOrderPage = () => {
  const [current, setCurrent] = useState(0)
  const [form] = Form.useForm()

  const next = () => {
    form
      .validateFields()
      .then(() => {
        setCurrent(current + 1)
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }

  const prev = () => {
    setCurrent(current - 1)
  }

  const handleSubmit = (values) => {
    console.log("Return request submitted:", values)
    message.success("Return request submitted successfully!")
    setCurrent(current + 1)
  }

  const steps = [
    {
      title: "Order Details",
      content: (
        <Form layout="vertical" form={form} initialValues={{ returnReason: "damaged" }}>
          <Form.Item
            name="orderNumber"
            label="Order Number"
            rules={[{ required: true, message: "Please enter your order number" }]}
          >
            <Input placeholder="Enter your order number (e.g., ORD-12345)" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter the email address used for the order" />
          </Form.Item>

          <Button type="primary" onClick={next}>
            Next
          </Button>
        </Form>
      ),
    },
    {
      title: "Return Details",
      content: (
        <Form layout="vertical" form={form}>
          <Form.Item
            name="returnReason"
            label="Reason for Return"
            rules={[{ required: true, message: "Please select a reason for return" }]}
          >
            <Select placeholder="Select a reason">
              <Option value="damaged">Product Damaged</Option>
              <Option value="defective">Product Defective</Option>
              <Option value="wrong">Wrong Product Received</Option>
              <Option value="notAsDescribed">Product Not As Described</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="returnDescription"
            label="Description"
            rules={[{ required: true, message: "Please provide details about the return" }]}
          >
            <TextArea
              rows={4}
              placeholder="Please provide more details about why you're returning the product"
            />
          </Form.Item>

          <Form.Item
            name="productImages"
            label="Product Images (Optional)"
            extra="Upload images of the product you want to return"
          >
            <Upload name="productImages" listType="picture" maxCount={3}>
              <Button icon={<UploadOutlined />}>Upload Images</Button>
            </Upload>
          </Form.Item>

          <div style={{ marginTop: 24 }}>
            <Button style={{ marginRight: 8 }} onClick={prev}>
              Previous
            </Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit Return Request
            </Button>
          </div>
        </Form>
      ),
    },
    {
      title: "Confirmation",
      content: (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: "64px", color: "#52c41a", marginBottom: "24px" }}>✓</div>
          <Title level={2}>Return Request Submitted!</Title>
          <Text>Your return request has been submitted successfully.</Text>
          <Paragraph style={{ margin: "16px 0" }}>
            We'll review your request and get back to you within 24-48 hours with further instructions.
          </Paragraph>
          <Button type="primary" href="/">
            Back to Home
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
          <Title level={2}>Return Your Order</Title>

          <Card style={{ marginBottom: "30px" }}>
            <Title level={4}>Return Policy</Title>
            <Paragraph>
              You can return your product within 7 days of delivery if:
            </Paragraph>
            <ul>
              <li>The product is damaged or defective</li>
              <li>You received the wrong product</li>
              <li>The product is not as described</li>
            </ul>
            <Paragraph>
              Please note that opened perfumes and attars can only be returned if they are defective.
            </Paragraph>
          </Card>

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

export default ReturnOrderPage