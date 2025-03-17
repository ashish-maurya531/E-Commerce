import { useState } from "react"
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"

const { Title } = Typography
const { TextArea } = Input

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingCategory, setEditingCategory] = useState(null)

  // Sample categories data
  const categories = [
    {
      id: 1,
      name: "Royal Attar",
      description: "Premium royal attar collection",
      products: 12,
    },
    {
      id: 2,
      name: "Perfume Spray",
      description: "Long-lasting perfume sprays",
      products: 8,
    },
  ]

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record)
              form.setFieldsValue(record)
              setIsModalVisible(true)
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Are you sure you want to delete this category?",
                content: "This action cannot be undone.",
                onOk() {
                  message.success("Category deleted successfully")
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
          <Title level={2}>Category Management</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null)
              form.resetFields()
              setIsModalVisible(true)
            }}
          >
            Add Category
          </Button>
        </div>

        <Table columns={columns} dataSource={categories} rowKey="id" />

        <Modal
          title={editingCategory ? "Edit Category" : "Add Category"}
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onOk={() => {
            form.validateFields().then((values) => {
              console.log(values)
              message.success(`Category ${editingCategory ? "updated" : "added"} successfully`)
              setIsModalVisible(false)
            })
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter category name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please enter category description" }]}
            >
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  )
}

export default Categories