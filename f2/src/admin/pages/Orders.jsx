"use client"

import { useState } from "react"
import {
  Table,
  Button,
  Space,
  Input,
  Tag,
  Modal,
  Descriptions,
  Steps,
  Card,
  Typography,
  Row,
  Col,
  Select,
  DatePicker,
  InputNumber,
  message,
} from "antd"
import { SearchOutlined, EyeOutlined, PrinterOutlined, ExportOutlined, FilterOutlined } from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"

const { Title, Text } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

const Orders = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [filterVisible, setFilterVisible] = useState(false)

  // Sample order data
  const orders = [
    {
      id: "ORD-12345",
      customer: "Rahul Sharma",
      email: "rahul@example.com",
      date: "2023-03-15 14:30",
      amount: 2499,
      payment: "Credit Card",
      status: "Delivered",
      items: [
        { id: 1, name: "Royal Attar Perfume", price: 899, quantity: 2 },
        { id: 2, name: "Oud Bakhoor", price: 699, quantity: 1 },
      ],
      address: "123 Main St, Mumbai, Maharashtra, 400001",
      phone: "+91 9876543210",
    },
    {
      id: "ORD-12346",
      customer: "Priya Mehta",
      email: "priya@example.com",
      date: "2023-03-15 13:45",
      amount: 1899,
      payment: "UPI",
      status: "Processing",
      items: [
        { id: 3, name: "Musk Attar", price: 699, quantity: 1 },
        { id: 4, name: "Premium Diffuser Oil", price: 1200, quantity: 1 },
      ],
      address: "456 Park Ave, Delhi, 110001",
      phone: "+91 9876543211",
    },
    {
      id: "ORD-12347",
      customer: "Ahmed Khan",
      email: "ahmed@example.com",
      date: "2023-03-15 12:20",
      amount: 3299,
      payment: "Net Banking",
      status: "Shipped",
      items: [
        { id: 5, name: "Special Edition Attar", price: 1499, quantity: 1 },
        { id: 6, name: "Luxury Body Spray", price: 599, quantity: 3 },
      ],
      address: "789 Lake Rd, Bangalore, Karnataka, 560001",
      phone: "+91 9876543212",
    },
    {
      id: "ORD-12348",
      customer: "Sneha Patel",
      email: "sneha@example.com",
      date: "2023-03-15 11:15",
      amount: 999,
      payment: "Cash on Delivery",
      status: "Pending",
      items: [
        { id: 7, name: "Rose Perfume Spray", price: 799, quantity: 1 },
        { id: 8, name: "Sandalwood Incense Sticks", price: 200, quantity: 1 },
      ],
      address: "101 Hill View, Chennai, Tamil Nadu, 600001",
      phone: "+91 9876543213",
    },
    {
      id: "ORD-12349",
      customer: "Vikram Singh",
      email: "vikram@example.com",
      date: "2023-03-15 10:30",
      amount: 1499,
      payment: "Credit Card",
      status: "Delivered",
      items: [{ id: 9, name: "Special Edition Attar", price: 1499, quantity: 1 }],
      address: "202 River Side, Kolkata, West Bengal, 700001",
      phone: "+91 9876543214",
    },
  ]

  // Table columns
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount - b.amount,
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Payment Method",
      dataIndex: "payment",
      key: "payment",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = ""
        switch (status) {
          case "Delivered":
            color = "success"
            break
          case "Processing":
            color = "processing"
            break
          case "Shipped":
            color = "warning"
            break
          case "Pending":
            color = "default"
            break
          case "Cancelled":
            color = "error"
            break
          default:
            color = "default"
        }
        return <Tag color={color}>{status}</Tag>
      },
      filters: [
        { text: "Delivered", value: "Delivered" },
        { text: "Processing", value: "Processing" },
        { text: "Shipped", value: "Shipped" },
        { text: "Pending", value: "Pending" },
        { text: "Cancelled", value: "Cancelled" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" icon={<EyeOutlined />} size="small" onClick={() => handleViewOrder(record)} />
          <Button icon={<PrinterOutlined />} size="small" onClick={() => handlePrintOrder(record.id)} />
        </Space>
      ),
    },
  ]

  // Handle view order
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setIsModalVisible(true)
  }

  // Handle print order
  const handlePrintOrder = (orderId) => {
    console.log("Printing order:", orderId)
    message.success(`Order ${orderId} sent to printer`)
  }

  // Get current step based on status
  const getOrderStep = (status) => {
    switch (status) {
      case "Pending":
        return 0
      case "Processing":
        return 1
      case "Shipped":
        return 2
      case "Delivered":
        return 3
      case "Cancelled":
        return -1
      default:
        return 0
    }
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input.Search placeholder="Search orders" allowClear style={{ width: 300 }} prefix={<SearchOutlined />} />
        <Space>
          <Button icon={<FilterOutlined />} onClick={() => setFilterVisible(!filterVisible)}>
            Filters
          </Button>
          <Button icon={<ExportOutlined />}>Export</Button>
        </Space>
      </div>

      {/* Advanced Filters */}
      {filterVisible && (
        <Card style={{ marginBottom: 16 }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8 }}>Date Range</div>
              <RangePicker style={{ width: "100%" }} />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8 }}>Status</div>
              <Select placeholder="Select status" style={{ width: "100%" }} allowClear>
                <Option value="Delivered">Delivered</Option>
                <Option value="Processing">Processing</Option>
                <Option value="Shipped">Shipped</Option>
                <Option value="Pending">Pending</Option>
                <Option value="Cancelled">Cancelled</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8 }}>Payment Method</div>
              <Select placeholder="Select payment method" style={{ width: "100%" }} allowClear>
                <Option value="Credit Card">Credit Card</Option>
                <Option value="UPI">UPI</Option>
                <Option value="Net Banking">Net Banking</Option>
                <Option value="Cash on Delivery">Cash on Delivery</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 8 }}>Amount Range</div>
              <Space>
                <InputNumber placeholder="Min" style={{ width: "100%" }} />
                <InputNumber placeholder="Max" style={{ width: "100%" }} />
              </Space>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: 16 }}>
            <Space>
              <Button>Reset</Button>
              <Button type="primary">Apply Filters</Button>
            </Space>
          </Row>
        </Card>
      )}

      <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 10 }} />

      {/* Order Details Modal */}
      <Modal
        title={`Order Details - ${selectedOrder?.id}`}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
          <Button key="print" icon={<PrinterOutlined />}>
            Print Invoice
          </Button>,
          <Button
            key="status"
            type="primary"
            disabled={selectedOrder?.status === "Delivered" || selectedOrder?.status === "Cancelled"}
          >
            Update Status
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <>
            {/* Order Status */}
            <Card style={{ marginBottom: 16 }}>
              <Steps
                current={getOrderStep(selectedOrder.status)}
                status={selectedOrder.status === "Cancelled" ? "error" : "process"}
              >
                <Steps.Step title="Pending" description="Order placed" />
                <Steps.Step title="Processing" description="Payment confirmed" />
                <Steps.Step title="Shipped" description="Order shipped" />
                <Steps.Step title="Delivered" description="Order delivered" />
              </Steps>
            </Card>

            {/* Order Information */}
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Customer Information" style={{ marginBottom: 16 }}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">{selectedOrder.customer}</Descriptions.Item>
                    <Descriptions.Item label="Email">{selectedOrder.email}</Descriptions.Item>
                    <Descriptions.Item label="Phone">{selectedOrder.phone}</Descriptions.Item>
                    <Descriptions.Item label="Shipping Address">{selectedOrder.address}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Order Information" style={{ marginBottom: 16 }}>
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Order ID">{selectedOrder.id}</Descriptions.Item>
                    <Descriptions.Item label="Date">{selectedOrder.date}</Descriptions.Item>
                    <Descriptions.Item label="Payment Method">{selectedOrder.payment}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                      <Tag
                        color={
                          selectedOrder.status === "Delivered"
                            ? "success"
                            : selectedOrder.status === "Processing"
                              ? "processing"
                              : selectedOrder.status === "Shipped"
                                ? "warning"
                                : selectedOrder.status === "Cancelled"
                                  ? "error"
                                  : "default"
                        }
                      >
                        {selectedOrder.status}
                      </Tag>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* Order Items */}
            <Card title="Order Items">
              <Table
                dataSource={selectedOrder.items}
                pagination={false}
                rowKey="id"
                columns={[
                  {
                    title: "Product",
                    dataIndex: "name",
                    key: "name",
                    render: (text) => (
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
                    title: "Price",
                    dataIndex: "price",
                    key: "price",
                    render: (price) => `₹${price}`,
                  },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                  {
                    title: "Total",
                    key: "total",
                    render: (_, record) => `₹${record.price * record.quantity}`,
                  },
                ]}
                summary={() => (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3} style={{ textAlign: "right" }}>
                      <Text strong>Subtotal:</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong>₹{selectedOrder.amount}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                )}
              />
            </Card>
          </>
        )}
      </Modal>
    </AdminLayout>
  )
}

export default Orders

