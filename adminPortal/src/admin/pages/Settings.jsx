import { useState } from "react"
import {
  Form,
  Input,
  Button,
  Card,
  Tabs,
  Switch,
  InputNumber,
  Select,
  Upload,
  message,
  Typography,
} from "antd"
import { UploadOutlined } from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"

const { Title } = Typography
const { TabPane } = Tabs
const { TextArea } = Input
const { Option } = Select

const Settings = () => {
  const [form] = Form.useForm()

  const handleSubmit = (values) => {
    console.log("Settings updated:", values)
    message.success("Settings updated successfully")
  }

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        <Title level={2}>Settings</Title>

        <Tabs defaultActiveKey="general">
          <TabPane tab="General Settings" key="general">
            <Card>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                  storeName: "AdilQadri",
                  email: "support@adilqadri.com",
                  phone: "+91 9876543210",
                  currency: "INR",
                }}
              >
                <Form.Item
                  name="storeName"
                  label="Store Name"
                  rules={[{ required: true, message: "Please enter store name" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Support Email"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Contact Phone"
                  rules={[{ required: true, message: "Please enter phone number" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="currency"
                  label="Currency"
                  rules={[{ required: true, message: "Please select currency" }]}
                >
                  <Select>
                    <Option value="INR">Indian Rupee (INR)</Option>
                    <Option value="USD">US Dollar (USD)</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="logo" label="Store Logo">
                  <Upload name="logo" listType="picture">
                    <Button icon={<UploadOutlined />}>Upload Logo</Button>
                  </Upload>
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab="Payment Settings" key="payment">
            <Card>
              <Form layout="vertical">
                <Form.Item label="Enable Cash on Delivery" name="enableCOD">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Enable Online Payment" name="enableOnline">
                  <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Minimum Order Amount" name="minOrderAmount">
                  <InputNumber
                    defaultValue={499}
                    formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Form>
            </Card>
          </TabPane>

          <TabPane tab="Shipping Settings" key="shipping">
            <Card>
              <Form layout="vertical">
                <Form.Item label="Free Shipping Threshold" name="freeShippingThreshold">
                  <InputNumber
                    defaultValue={999}
                    formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                  />
                </Form.Item>

                <Form.Item label="Default Shipping Fee" name="shippingFee">
                  <InputNumber
                    defaultValue={99}
                    formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </Form>
            </Card>
          </TabPane>
        </Tabs>
      </div>
    </AdminLayout>
  )
}

export default Settings