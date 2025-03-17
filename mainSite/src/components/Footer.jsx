import { Layout, Row, Col, Typography, Space, Divider } from "antd"
import { Link } from "react-router-dom"
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons"

const { Footer } = Layout
const { Title, Text, Paragraph } = Typography

const AppFooter = () => {
  return (
    <Footer style={{ background: "#001529", color: "white", padding: "40px 50px" }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "white" }}>
            Medic
          </Title>
          <Paragraph style={{ color: "#ccc" }}>
            Medic is a premium brand offering the best quality health and wellness products to our customers.
            We are committed to providing the best customer service and support.
            We are committed to providing the highest quality products at the lowest possible prices.
            
          </Paragraph>
          <Space>
            <Link to="#">
              <FacebookOutlined style={{ color: "white", fontSize: "20px" }} />
            </Link>
            <Link to="#">
              <TwitterOutlined style={{ color: "white", fontSize: "20px" }} />
            </Link>
            <Link to="#">
              <InstagramOutlined style={{ color: "white", fontSize: "20px" }} />
            </Link>
            <Link to="#">
              <YoutubeOutlined style={{ color: "white", fontSize: "20px" }} />
            </Link>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "white" }}>
            Quick Links
          </Title>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/" style={{ color: "#ccc" }}>
                Home
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/about" style={{ color: "#ccc" }}>
                About Us
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/products" style={{ color: "#ccc" }}>
                Products
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/contact" style={{ color: "#ccc" }}>
                Contact Us
              </Link>
            </li>
          </ul>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "white" }}>
            Customer Service
          </Title>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/track-order" style={{ color: "#ccc" }}>
                Track Order
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/return-order" style={{ color: "#ccc" }}>
                Return Policy
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/shipping" style={{ color: "#ccc" }}>
                Shipping Info
              </Link>
            </li>
            <li style={{ marginBottom: "10px" }}>
              <Link to="/faq" style={{ color: "#ccc" }}>
                FAQs
              </Link>
            </li>
          </ul>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Title level={4} style={{ color: "white" }}>
            Contact Us
          </Title>
          <Space direction="vertical" style={{ color: "#ccc" }}>
            <Space>
              <HomeOutlined />
              <Text style={{ color: "#ccc" }}>123 Main Street, Mumbai, India</Text>
            </Space>
            <Space>
              <PhoneOutlined />
              <Text style={{ color: "#ccc" }}>+91 9876543210</Text>
            </Space>
            <Space>
              <MailOutlined />
              <Text style={{ color: "#ccc" }}>info@adilqadri.com</Text>
            </Space>
          </Space>
        </Col>
      </Row>

      <Divider style={{ borderColor: "#333", margin: "24px 0" }} />

      <div style={{ textAlign: "center" }}>
        <Text style={{ color: "#ccc" }}>© {new Date().getFullYear()} AdilQadri. All Rights Reserved.</Text>
      </div>
    </Footer>
  )
}

export default AppFooter

