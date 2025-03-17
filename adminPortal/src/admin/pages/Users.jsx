import { useState } from "react"
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Select,
  message,
  Tag,
  Typography,
} from "antd"
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"

const { Title } = Typography
const { Option } = Select

const Users = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingUser, setEditingUser] = useState(null)

  // Sample user data
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Customer",
      status: "Active",
      joinDate: "2023-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2023-02-20",
    },
  ]

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "Admin" ? "blue" : "green"}>{role}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "success" : "error"}>{status}</Tag>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record)
              form.setFieldsValue(record)
              setIsModalVisible(true)
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Are you sure you want to delete this user?",
                content: "This action cannot be undone.",
                onOk() {
                  message.success("User deleted successfully")
                },
              })
            }}
          />
        </Space>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
          <Title level={2}>User Management</Title>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              setEditingUser(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            Add User
          </Button>
        </div>

        <Table columns={columns} dataSource={users} rowKey="id" />

        <Modal
          title={editingUser ? "Edit User" : "Add User"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => {
            form.validateFields().then((values) => {
              console.log(values)
              message.success(`User ${editingUser ? "updated" : "added"} successfully`)
              setIsModalVisible(false)
            })
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select>
                <Option value="Admin">Admin</Option>
                <Option value="Customer">Customer</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default Users