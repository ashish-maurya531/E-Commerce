import { Form, Input, Button, Checkbox, Card, Typography, Layout, Divider } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
// Fix the logo import
import logo from "../../assets/logo.png" // This will be created

const { Title, Text } = Typography
const { Content } = Layout

const Login = () => {
  const navigate = useNavigate()

  const onFinish = (values) => {
    console.log("Success:", values)
    // Here you would typically make an API call to authenticate the user
    navigate("/admin/dashboard")
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9f9f0" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src={logo || "/placeholder.svg"} alt="AdilQadri" style={{ height: 60 }} />
            <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
              Admin Login
            </Title>
            <Text type="secondary">Enter your credentials to access the admin panel</Text>
          </div>

          <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
            <Form.Item name="username" rules={[{ required: true, message: "Please input your Username!" }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" size="large" />
            </Form.Item>

            <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a href="/admin/forgot-password">Forgot password?</a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Log in
              </Button>
            </Form.Item>

            <Divider plain>Or</Divider>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">Contact your administrator if you don't have access</Text>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  )
}

export default Login

