// import { useState, useEffect } from "react"
// import { Form, Input, Button, Checkbox, Card, Typography, Layout, Divider, message, App,} from "antd"
// import { notification } from 'antd';
// import { UserOutlined, LockOutlined } from "@ant-design/icons"
// import { useNavigate, useLocation } from "react-router-dom"
// import authService from "../../services/auth.service"
// import logo from "../../assets/logo.png"

// const { Title, Text } = Typography
// const { Content } = Layout

// const Login = () => {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { message } = App.useApp()

//   useEffect(() => {
//     if (location.state?.fromLogout) {
//       localStorage.clear()
//     }
//     const user = authService.getCurrentUser()
//     if (user && (user.role === 'admin' || user.role === 'franchiser')) {
//       navigate('/admin/dashboard', { replace: true })
//     }
//   }, [navigate, location])

//   const onFinish = async (values) => {
//     try {
//       const response = await authService.login(values.username, values.password)
//       const user = response.user

//       // Check if user exists and has correct role
//       if (!user || user.length === 0) {
//         notification.error({
//             message: 'Error',
//             description: 'No such admin account found!',
//             duration: 3, // Toast duration (in seconds)
//         });
//         return;
//     }

//       if (user.role !== 'admin' && user.role !== 'franchiser') {
//         message.error('Access denied. This portal is for administrators only.')
//         await authService.logout()
//         return
//       }

//       message.success('Login successful!')
//       navigate("/admin/dashboard", { replace: true })
//     } catch (error) {
//       // Handle different error cases
//       if (error.response?.status === 404) {
//         message.error('No such admin account found!')
//       } else if (error.response?.status === 401) {
//         message.error('Invalid credentials. Please check your email and password.')
//       } else if (error.response?.data?.message) {
//         message.error(error.response.data.message)
//       } else {
//         message.error('An error occurred during login. Please try again.')
//       }
//     }
//   }

//   return (
//     <Layout style={{ minHeight: "100vh", background: "#f9f9f0" }}>
//       <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
//         <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
//           <div style={{ textAlign: "center", marginBottom: 24 }}>
//             <img src={logo || "/placeholder.svg"} alt="AdilQadri" style={{ height: 60 }} />
//             <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
//               Admin Login
//             </Title>
//             <Text type="secondary">Enter your credentials to access the admin panel</Text>
//           </div>

//           <Form name="login" initialValues={{ remember: true }} onFinish={onFinish} layout="vertical">
//             <Form.Item 
//               name="username" 
//               rules={[{ required: true, message: "Please input your email!" }]}
//             >
//               <Input 
//                 prefix={<UserOutlined className="site-form-item-icon" />} 
//                 placeholder="Email" 
//                 size="large" 
//                 type="email"
//               />
//             </Form.Item>

//             <Form.Item 
//               name="password" 
//               rules={[{ required: true, message: "Please input your Password!" }]}
//             >
//               <Input.Password
//                 prefix={<LockOutlined className="site-form-item-icon" />}
//                 placeholder="Password"
//                 size="large"
//               />
//             </Form.Item>

//             <Form.Item>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <Form.Item name="remember" valuePropName="checked" noStyle>
//                   <Checkbox>Remember me</Checkbox>
//                 </Form.Item>
//                 <a href="/admin/forgot-password">Forgot password?</a>
//               </div>
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit" size="large" block>
//                 Log in
//               </Button>
//             </Form.Item>

//             <Divider plain>Or</Divider>

//             <div style={{ textAlign: "center" }}>
//               <Text type="secondary">Contact your administrator if you don't have access</Text>
//             </div>
//           </Form>
//         </Card>
//       </Content>
//     </Layout>
//   )
// }

// export default Login;



import { useState, useEffect } from "react"
import { Form, Input, Button, Checkbox, Card, Typography, Layout, Divider, message,notification } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useNavigate, useLocation } from "react-router-dom"
import authService from "../../services/auth.service"
import logo from "../../assets/logo.png"

const { Title, Text } = Typography
const { Content } = Layout

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) return;
    
        // Verify access token validity
        await authService.getProfile();
    
        if (['admin', 'franchiser'].includes(user.role)) {
    
            // Display notification first
            notification.success({
                message: 'Session refreshed!',
                description: 'You have been logged in again.',
                duration: 3, // Toast duration (in seconds)
            });
    
            // Delay the navigation slightly
            setTimeout(() => {
                navigate('/admin/dashboard', { replace: true });
            }, 300);  // Delayed navigation to allow notification rendering
    
        } else {
            message.error('Access denied. Invalid permissions.');
            await authService.logout();
        }
    } 
     catch (error) {
        if (error.response?.status === 401) {
          try {
            // Attempt token refresh
            const refreshSuccess = await authService.checkRefreshToken()
            if (refreshSuccess) {
              const refreshedUser = authService.getCurrentUser()
              if (['admin', 'franchiser'].includes(refreshedUser.role)) {
                setTimeout(() => {
                  notification.success({
                      message: 'Session refreshed!',
                      description: 'You have been logged in again.',
                      duration: 3, // Toast duration (in seconds)
                  });
              }, 100);
                navigate('/admin/dashboard', { replace: true })
                return
              }
            }
          } catch (refreshError) {
            message.error('Session expired. Please login again.')
           
          }
        }
        await authService.logout()
      }
    }

    if (location.state?.fromLogout) {
      localStorage.clear()
      message.success('Logged out successfully!')
      setTimeout(() => {
        notification.success({
            message: 'Logged out successfully!',
            description: 'You have been logged out.',
            duration: 3, // Toast duration (in seconds)
        });
    }, 100);
    }

    checkAuthentication()
  }, [navigate, location])

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await authService.login(values.username, values.password)
      const user = authService.getCurrentUser()

      if (!user) {
        throw new Error('Login failed. Please try again.')
      }

      if (!['admin', 'franchiser'].includes(user.role)) {
        message.error('Access denied. Administrator privileges required.')
        await authService.logout()
        return
      }

      message.success(`Welcome back, ${user.name || 'Admin'}!`)
      navigate("/admin/dashboard", { replace: true })
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.'
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = 'Invalid request format'
            break
          case 401:
            errorMessage = 'Invalid email or password'
            break
          case 403:
            errorMessage = 'Account not authorized for admin access'
            break
          case 404:
            errorMessage = 'Admin account not found'
            break
          case 500:
            errorMessage = 'Server error. Please try again later.'
            break
        }
      }
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f9f9f0" }}>
      <Content style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card style={{ width: 400, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src={logo || "/placeholder.svg"} alt="Company Logo" style={{ height: 60 }} />
            <Title level={3} style={{ marginTop: 16, marginBottom: 8 }}>
              Admin Portal
            </Title>
            <Text type="secondary">Secure administrator access</Text>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 8, message: 'Password must be at least 8 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                autoComplete="current-password"
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
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                disabled={loading}
              >
                Log in
              </Button>
            </Form.Item>

            <Divider plain>Security Notice</Divider>

            <div style={{ textAlign: "center" }}>
              <Text type="secondary">
                All login attempts are monitored. Unauthorized access will be prosecuted.
              </Text>
            </div>
          </Form>
        </Card>
      </Content>
    </Layout>
  )
}

export default Login