import { useState, useEffect } from "react"
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
import userService from "../../services/user.service"

const { Title } = Typography
const { Option } = Select

const Users = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingUser, setEditingUser] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch (error) {
      message.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (values) => {
    try {
      // Ensure role is included in values
      const userData = {
        ...values,
        role: values.role || (editingUser ? editingUser.role : 'user') // Default to 'user' for new users
      };

      if (editingUser) {
        await userService.updateUser(editingUser.id, userData);
        message.success("User updated successfully");
      } else {
        await userService.createUser(userData);
        message.success("User added successfully");
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('Operation error:', error);
      message.error(error.response?.data?.message || "Operation failed");
    }
  }

  const handleDelete = async (userId) => {
    try {
      await userService.deleteUser(userId)
      message.success("User deleted successfully")
      fetchUsers()
    } catch (error) {
      message.error("Failed to delete user")
    }
  }

  const columns = [
    {
      title: "Name",
      key: "name",
      render: (record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneno",
      key: "phoneno",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "blue" : "green"}>{role}</Tag>
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
      dataIndex: "createdat",
      key: "createdat",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue({
                firstname: record.firstname,
                lastname: record.lastname,
                email: record.email,
                phoneno: record.phoneno,
                address: record.address,
                city: record.city,
                state: record.state,
                pincode: record.pincode,
                role: record.role, // Make sure role is included
                status: record.status,
              });
              setIsModalVisible(true);
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
                  handleDelete(record.id)
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

        <Table 
          columns={columns} 
          dataSource={users} 
          rowKey="id" 
          loading={loading}
        />

        <Modal
          title={editingUser ? `Edit Details` : `Add`}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => form.submit()}
        >
          <Form 
            form={form} 
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="firstname"
              label="First Name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[{ required: true, message: "Please enter last name" }]}
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
            {!editingUser && (
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please enter password" }]}
              >
                <Input.Password />
              </Form.Item>
            )}
            <Form.Item
              name="phoneno"
              label="Phone Number"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="state"
              label="State"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="pincode"
              label="Pincode"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select>
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
                <Option value="distributer">Distributor</Option>
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