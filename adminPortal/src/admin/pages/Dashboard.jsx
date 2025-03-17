import { Row, Col, Card, Statistic, Table, Typography, Progress, List, Avatar, Tag } from "antd"
import {
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"
import { Line, Pie } from "@ant-design/charts"

const { Title, Text } = Typography

const Dashboard = () => {
  // Sample data for statistics
  const stats = [
    {
      title: "Total Sales",
      value: 124350,
      prefix: "₹",
      icon: <DollarOutlined />,
      color: "#1890ff",
      increase: 15.2,
    },
    {
      title: "Total Orders",
      value: 1243,
      icon: <ShoppingCartOutlined />,
      color: "#52c41a",
      increase: 8.5,
    },
    {
      title: "Total Products",
      value: 156,
      icon: <ShoppingOutlined />,
      color: "#722ed1",
      increase: 3.2,
    },
    {
      title: "Total Customers",
      value: 3254,
      icon: <UserOutlined />,
      color: "#faad14",
      increase: 12.7,
    },
  ]

  // Sample data for recent orders
  const recentOrders = [
    {
      key: "1",
      id: "ORD-12345",
      customer: "Rahul Sharma",
      date: "2023-03-15 14:30",
      amount: 2499,
      status: "Delivered",
    },
    {
      key: "2",
      id: "ORD-12346",
      customer: "Priya Mehta",
      date: "2023-03-15 13:45",
      amount: 1899,
      status: "Processing",
    },
    {
      key: "3",
      id: "ORD-12347",
      customer: "Ahmed Khan",
      date: "2023-03-15 12:20",
      amount: 3299,
      status: "Shipped",
    },
    {
      key: "4",
      id: "ORD-12348",
      customer: "Sneha Patel",
      date: "2023-03-15 11:15",
      amount: 999,
      status: "Pending",
    },
    {
      key: "5",
      id: "ORD-12349",
      customer: "Vikram Singh",
      date: "2023-03-15 10:30",
      amount: 1499,
      status: "Delivered",
    },
  ]

  // Sample data for top selling products
  const topProducts = [
    {
      title: "Royal Attar Perfume",
      sales: 245,
      percent: 85,
    },
    {
      title: "Musk Attar",
      sales: 190,
      percent: 70,
    },
    {
      title: "Rose Perfume Spray",
      sales: 145,
      percent: 55,
    },
    {
      title: "Oud Bakhoor",
      sales: 120,
      percent: 45,
    },
    {
      title: "Premium Diffuser Oil",
      sales: 95,
      percent: 35,
    },
  ]

  // Sample data for sales chart
  const salesData = [
    { month: "Jan", sales: 35000 },
    { month: "Feb", sales: 42000 },
    { month: "Mar", sales: 38000 },
    { month: "Apr", sales: 45000 },
    { month: "May", sales: 50000 },
    { month: "Jun", sales: 55000 },
    { month: "Jul", sales: 60000 },
    { month: "Aug", sales: 58000 },
    { month: "Sep", sales: 65000 },
    { month: "Oct", sales: 70000 },
    { month: "Nov", sales: 75000 },
    { month: "Dec", sales: 90000 },
  ]

  // Sample data for category distribution
  const categoryData = [
    { type: "Attar", value: 35 },
    { type: "Perfume Spray", value: 25 },
    { type: "Royal Attar", value: 15 },
    { type: "Bakhoor", value: 10 },
    { type: "Incense Sticks", value: 8 },
    { type: "Diffuser Oil", value: 7 },
  ]

  // Chart configurations
  const salesConfig = {
    data: salesData,
    height: 300,
    xField: "month",
    yField: "sales",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  }

  const pieConfig = {
    data: categoryData,
    height: 300,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: "{name} {percentage}",
    },
    interactions: [{ type: "element-active" }],
  }

  // Table columns for recent orders
  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₹${amount}`,
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
          default:
            color = "default"
        }
        return <Tag color={color}>{status}</Tag>
      },
    },
  ]

  return (
    <AdminLayout>
      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={0}
                valueStyle={{ color: stat.color }}
                prefix={stat.prefix || ""}
                suffix=""
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                <Text type="secondary">
                  <ArrowUpOutlined style={{ color: "#52c41a" }} /> {stat.increase}% from last month
                </Text>
                <div
                  style={{
                    background: `${stat.color}20`,
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: stat.color,
                    fontSize: "20px",
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={16}>
          <Card title="Sales Overview">
            <Line {...salesConfig} />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Category Distribution">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders and Top Products */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Orders" extra={<a href="/admin/orders">View All</a>}>
            <Table columns={columns} dataSource={recentOrders} pagination={false} size="small" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Selling Products" extra={<a href="/admin/products">View All</a>}>
            <List
              itemLayout="horizontal"
              dataSource={topProducts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar shape="square" size="large" src="/placeholder.svg?height=40&width=40" />}
                    title={item.title}
                    description={`${item.sales} units sold`}
                  />
                  <div>
                    <Progress percent={item.percent} size="small" />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </AdminLayout>
  )
}

export default Dashboard

