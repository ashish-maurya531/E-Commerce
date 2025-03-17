"use client"

import { useState } from "react"
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Form,
  InputNumber,
  Select,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  Alert,
  Tooltip,
  message,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  MinusOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"

const { Title, Text } = Typography
const { Option } = Select

const Inventory = () => {
  const [isAdjustModalVisible, setIsAdjustModalVisible] = useState(false)
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [form] = Form.useForm()

  // Sample inventory data
  const inventory = [
    {
      id: 1,
      name: "Royal Attar Perfume",
      sku: "RAP-001",
      category: "Royal Attar",
      stock: 120,
      minStock: 20,
      supplier: "AdilQadri",
      lastUpdated: "2023-03-10",
      status: "In Stock",
    },
    {
      id: 2,
      name: "Musk Attar",
      sku: "MA-002",
      category: "Attar",
      stock: 85,
      minStock: 15,
      supplier: "AdilQadri",
      lastUpdated: "2023-03-12",
      status: "In Stock",
    },
    {
      id: 3,
      name: "Rose Perfume Spray",
      sku: "RPS-003",
      category: "Perfume Spray",
      stock: 65,
      minStock: 15,
      supplier: "AdilQadri",
      lastUpdated: "2023-03-08",
      status: "In Stock",
    },
    {
      id: 4,
      name: "Oud Bakhoor",
      sku: "OB-004",
      category: "Bakhoor",
      stock: 40,
      minStock: 10,
      supplier: "AdilQadri",
      lastUpdated: "2023-03-05",
      status: "In Stock",
    },
    {
      id: 5,
      name: "Premium Diffuser Oil",
      sku: "PDO-005",
      category: "Diffuser Oil",
      stock: 55,
      minStock: 15,
      supplier: "AdilQadri",
      lastUpdated: "2023-03-15",
      status: "In Stock",
    },
    {
      id: 6,
      name: "Luxury Body Spray",
      sku: "LBS-006",
      category: "Body Spray",
      stock: 0,
      minStock: 10,
      supplier: "AdilQadri",
      lastUpdated: "2023-03-01",
      status: "Out of Stock",
    },
    {
      id: 7,
      name: "Sandalwood Incense Sticks",
      sku: "SIS-007",
      category: "Incense Sticks",
      stock: 150,
      minStock: 30,
      supplier: "AdilQadri",
      lastUpdated: "2023-03-14",
      status: "In Stock",
    },
    {
      id: 8,
      name: "Special Edition Attar",
      sku: "SEA-008",
      category: "Attar",
      stock: 12,
      minStock: 15,
      supplier: "AdilQadri",
      lastUpdated: "2023-03-07",
      status: "Low Stock",
    },
  ]

  // Sample inventory history data
  const inventoryHistory = [
    {
      id: 1,
      productId: 1,
      date: "2023-03-10 14:30",
      type: "Addition",
      quantity: 50,
      user: "Admin User",
      notes: "Restocked from supplier",
    },
    {
      id: 2,
      productId: 1,
      date: "2023-03-05 10:15",
      type: "Subtraction",
      quantity: 10,
      user: "Admin User",
      notes: "Order fulfillment",
    },
    {
      id: 3,
      productId: 1,
      date: "2023-03-01 09:45",
      type: "Addition",
      quantity: 80,
      user: "Admin User",
      notes: "Initial stock",
    },
  ]

  // Table columns
  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Space>
          <img
            src="/placeholder.svg?height=40&width=40"
            alt={text}
            style={{ width: 40, height: 40, borderRadius: 4 }}
          />
          {text}
        </Space>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: "Attar", value: "Attar" },
        { text: "Royal Attar", value: "Royal Attar" },
        { text: "Perfume Spray", value: "Perfume Spray" },
        { text: "Body Spray", value: "Body Spray" },
        { text: "Bakhoor", value: "Bakhoor" },
        { text: "Incense Sticks", value: "Incense Sticks" },
        { text: "Diffuser Oil", value: "Diffuser Oil" },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Current Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock, record) => {
        let color = ""
        if (stock === 0) {
          color = "error"
        } else if (stock < record.minStock) {
          color = "warning"
        } else {
          color = "success"
        }
        return <Text type={color}>{stock}</Text>
      },
    },
    {
      title: "Min. Stock",
      dataIndex: "minStock",
      key: "minStock",
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      key: "supplier",
    },
    {
      title: "Last Updated",
      dataIndex: "lastUpdated",
      key: "lastUpdated",
      sorter: (a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = ""
        let icon = null
        switch (status) {
          case "In Stock":
            color = "success"
            icon = <CheckCircleOutlined />
            break
          case "Out of Stock":
            color = "error"
            icon = <ExclamationCircleOutlined />
            break
          case "Low Stock":
            color = "warning"
            icon = <WarningOutlined />
            break
          default:
            color = "default"
            icon = <SyncOutlined />
        }
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        )
      },
      filters: [
        { text: "In Stock", value: "In Stock" },
        { text: "Out of Stock", value: "Out of Stock" },
        { text: "Low Stock", value: "Low Stock" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Adjust Stock">
            <Button type="primary" icon={<PlusOutlined />} size="small" onClick={() => handleAdjustStock(record)} />
          </Tooltip>
          <Tooltip title="View History">
            <Button icon={<HistoryOutlined />} size="small" onClick={() => handleViewHistory(record)} />
          </Tooltip>
        </Space>
      ),
    },
  ]

  // Handle adjust stock
  const handleAdjustStock = (product) => {
    setSelectedProduct(product)
    form.resetFields()
    setIsAdjustModalVisible(true)
  }

  // Handle view history
  const handleViewHistory = (product) => {
    setSelectedProduct(product)
    setIsHistoryModalVisible(true)
  }

  // Handle form submission
  const handleSubmit = (values) => {
    console.log("Form values:", values)

    // Here you would typically make an API call to update the inventory
    message.success(`Inventory adjusted successfully`)
    setIsAdjustModalVisible(false)
  }

  // Calculate inventory statistics
  const totalProducts = inventory.length
  const inStockProducts = inventory.filter((item) => item.status === "In Stock").length
  const lowStockProducts = inventory.filter((item) => item.status === "Low Stock").length
  const outOfStockProducts = inventory.filter((item) => item.status === "Out of Stock").length

  return (
    <AdminLayout>
      {/* Inventory Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Products" value={totalProducts} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="In Stock"
              value={inStockProducts}
              valueStyle={{ color: "#52c41a" }}
              suffix={`/ ${totalProducts}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Low Stock"
              value={lowStockProducts}
              valueStyle={{ color: "#faad14" }}
              suffix={`/ ${totalProducts}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Out of Stock"
              value={outOfStockProducts}
              valueStyle={{ color: "#f5222d" }}
              suffix={`/ ${totalProducts}`}
            />
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      {lowStockProducts > 0 && (
        <Alert
          message="Low Stock Alert"
          description={`${lowStockProducts} products are running low on stock. Please consider restocking soon.`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" type="primary">
              View Low Stock Items
            </Button>
          }
        />
      )}

      {/* Out of Stock Alert */}
      {outOfStockProducts > 0 && (
        <Alert
          message="Out of Stock Alert"
          description={`${outOfStockProducts} products are currently out of stock. Please restock as soon as possible.`}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" danger>
              View Out of Stock Items
            </Button>
          }
        />
      )}

      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input.Search placeholder="Search inventory" allowClear style={{ width: 300 }} prefix={<SearchOutlined />} />
        <Space>
          <Button type="primary" icon={<PlusOutlined />}>
            Add New Product
          </Button>
        </Space>
      </div>

      <Table columns={columns} dataSource={inventory} rowKey="id" pagination={{ pageSize: 10 }} />

      {/* Adjust Stock Modal */}
      <Modal
        title={`Adjust Stock - ${selectedProduct?.name}`}
        visible={isAdjustModalVisible}
        onCancel={() => setIsAdjustModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="adjustmentType"
            label="Adjustment Type"
            rules={[{ required: true, message: "Please select adjustment type" }]}
          >
            <Select placeholder="Select adjustment type">
              <Option value="addition">
                <Space>
                  <PlusOutlined style={{ color: "#52c41a" }} />
                  Add Stock
                </Space>
              </Option>
              <Option value="subtraction">
                <Space>
                  <MinusOutlined style={{ color: "#f5222d" }} />
                  Remove Stock
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity" }]}>
            <InputNumber min={1} placeholder="Enter quantity" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} placeholder="Enter notes (e.g., reason for adjustment)" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setIsAdjustModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Adjust Stock
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Inventory History Modal */}
      <Modal
        title={`Inventory History - ${selectedProduct?.name}`}
        visible={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsHistoryModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <Table
          dataSource={inventoryHistory.filter((item) => item.productId === selectedProduct?.id)}
          rowKey="id"
          pagination={false}
          columns={[
            {
              title: "Date",
              dataIndex: "date",
              key: "date",
            },
            {
              title: "Type",
              dataIndex: "type",
              key: "type",
              render: (type) => (
                <Tag color={type === "Addition" ? "success" : "error"}>
                  {type === "Addition" ? <PlusOutlined /> : <MinusOutlined />} {type}
                </Tag>
              ),
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              key: "quantity",
            },
            {
              title: "User",
              dataIndex: "user",
              key: "user",
            },
            {
              title: "Notes",
              dataIndex: "notes",
              key: "notes",
            },
          ]}
        />
      </Modal>
    </AdminLayout>
  )
}

export default Inventory

