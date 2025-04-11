"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  Tag, 
  Space, 
  Button, 
  Modal, 
  Typography, 
  Select,
  message,
  Drawer,
  Descriptions,
  List,
  Image
} from "antd"
import { EyeOutlined } from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"
import orderService from "../../services/order.service"

const { Title } = Typography
const { Option } = Select

const safeParseImages = (images) => {
  try {
    if (typeof images === 'string') {
      return JSON.parse(images);
    }
    if (Array.isArray(images)) {
      return images;
    }
    return [];
  } catch (error) {
    console.error('Error parsing images:', error);
    return [];
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getAllOrders()
      setOrders(data)
    } catch (error) {
      message.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setStatusUpdateLoading(true)
      await orderService.updateOrderStatus(orderId, newStatus)
      message.success("Order status updated successfully")
      fetchOrders()
    } catch (error) {
      message.error("Failed to update order status")
    } finally {
      setStatusUpdateLoading(false)
    }
  }

  const handleViewDetails = async (orderId) => {
    try {
      const orderDetails = await orderService.getOrderById(orderId)
      setSelectedOrder(orderDetails)
      setDrawerVisible(true)
    } catch (error) {
      message.error("Failed to fetch order details")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'gold'
      case 'Processing': return 'blue'
      case 'Shipped': return 'cyan'
      case 'Delivered': return 'green'
      case 'Cancelled': return 'red'
      default: return 'default'
    }
  }

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <a onClick={() => handleViewDetails(id)}>{id}</a>
    },
    {
      title: 'Customer',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (_, record) => (
        <div>
          <div>{record.customer_name}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>{record.email}</div>
        </div>
      )
    },
    {
      title: 'Amount Details',
      key: 'amount',
      render: (record) => (
        <div>
          <div>Total: ₹{record.total_amount}</div>
          <div>MRP: ₹{record.total_mrp}</div>
          <div>DP: ₹{record.total_dp}</div>
          <div>PV: {record.total_pv}</div>
        </div>
      )
    },
    {
      title: 'Payment Method',
      dataIndex: 'payment_method',
      key: 'payment_method'
    },
    {
      title: 'Status',
      key: 'status',
      render: (record) => (
        <Space direction="vertical">
          <Tag color={getStatusColor(record.status)}>{record.status}</Tag>
          <Select
            defaultValue={record.status}
            style={{ width: 120 }}
            loading={statusUpdateLoading}
            onChange={(value) => handleStatusChange(record.id, value)}
            disabled={record.status === 'Delivered' || record.status === 'Cancelled'}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Processing">Processing</Option>
            <Option value="Shipped">Shipped</Option>
            <Option value="Delivered">Delivered</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        </Space>
      )
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record.id)}
        >
          View Details
        </Button>
      )
    }
  ]

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        <Title level={2}>Orders</Title>
        
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            total: orders.length,
            showTotal: (total) => `Total ${total} orders`,
            showSizeChanger: true,
            showQuickJumper: true
          }}
        />

        <Drawer
          title="Order Details"
          placement="right"
          width={720}
          onClose={() => {
            setDrawerVisible(false)
            setSelectedOrder(null)
          }}
          open={drawerVisible}
        >
          {selectedOrder && (
            <>
              <Descriptions title="Customer Information" bordered>
                <Descriptions.Item label="Name" span={3}>
                  {selectedOrder.customer_name}
                </Descriptions.Item>
                <Descriptions.Item label="Email" span={3}>
                  {selectedOrder.email}
                </Descriptions.Item>
                <Descriptions.Item label="Phone" span={3}>
                  {selectedOrder.phone}
                </Descriptions.Item>
                <Descriptions.Item label="Address" span={3}>
                  {selectedOrder.address}
                </Descriptions.Item>
              </Descriptions>

              <Descriptions title="Order Information" bordered style={{ marginTop: 20 }}>
                <Descriptions.Item label="Order ID" span={3}>
                  {selectedOrder.id}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={3}>
                  <Tag color={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Payment Method" span={3}>
                  {selectedOrder.payment_method}
                </Descriptions.Item>
                <Descriptions.Item label="Order Date" span={3}>
                  {new Date(selectedOrder.created_at).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>

              <Title level={4} style={{ margin: '20px 0' }}>Order Items</Title>
              <List
                itemLayout="horizontal"
                dataSource={selectedOrder.items}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Image 
                          src={`http://localhost:9000${safeParseImages(item.images)[0] || ''}`}
                          width={80}
                          height={80}
                          style={{ objectFit: 'cover' }}
                          fallback="data:image/png;base64,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"
                        />
                      }
                      title={item.product_name}
                      description={
                        <div>
                          <div>Quantity: {item.quantity}</div>
                          <div>Size: {item.size}</div>
                          <div>MRP: ₹{item.mrp}</div>
                          <div>DP: ₹{item.dp}</div>
                          <div>PV: {item.pv}</div>
                        </div>
                      }
                    />
                    <div>
                      <Title level={5}>₹{item.price * item.quantity}</Title>
                    </div>
                  </List.Item>
                )}
              />

              <Descriptions bordered style={{ marginTop: 20 }}>
                <Descriptions.Item label="Total MRP" span={3}>
                  ₹{selectedOrder.total_mrp}
                </Descriptions.Item>
                <Descriptions.Item label="Total DP" span={3}>
                  ₹{selectedOrder.total_dp}
                </Descriptions.Item>
                <Descriptions.Item label="Total PV" span={3}>
                  {selectedOrder.total_pv}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount" span={3}>
                  <Title level={4}>₹{selectedOrder.total_amount}</Title>
                </Descriptions.Item>
              </Descriptions>
            </>
          )}
        </Drawer>
      </div>
    </AdminLayout>
  )
}

export default Orders

