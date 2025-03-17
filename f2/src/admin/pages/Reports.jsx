import { useState } from "react"
import { Card, Row, Col, DatePicker, Button, Table, Typography, Select } from "antd"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import AdminLayout from "../components/AdminLayout"

const { Title } = Typography
const { RangePicker } = DatePicker
const { Option } = Select

const Reports = () => {
  const [dateRange, setDateRange] = useState(null)
  const [reportType, setReportType] = useState("sales")

  // Sample data for charts and tables
  const salesData = [
    { name: "Jan", sales: 4000 },
    { name: "Feb", sales: 3000 },
    { name: "Mar", sales: 2000 },
    { name: "Apr", sales: 2780 },
    { name: "May", sales: 1890 },
    { name: "Jun", sales: 2390 },
  ]

  const topProducts = [
    { id: 1, name: "Royal Attar Perfume", sales: 150, revenue: 134850 },
    { id: 2, name: "Musk Attar", sales: 120, revenue: 83880 },
    { id: 3, name: "Rose Perfume Spray", sales: 100, revenue: 79900 },
  ]

  const columns = [
    { title: "Product Name", dataIndex: "name", key: "name" },
    { title: "Units Sold", dataIndex: "sales", key: "sales" },
    { 
      title: "Revenue", 
      dataIndex: "revenue", 
      key: "revenue",
      render: (value) => `₹${value.toLocaleString()}`
    },
  ]

  return (
    <AdminLayout>
      <div style={{ padding: "24px" }}>
        <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={2}>Reports & Analytics</Title>
          <Space>
            <Select 
              defaultValue="sales" 
              style={{ width: 120 }}
              onChange={(value) => setReportType(value)}
            >
              <Option value="sales">Sales</Option>
              <Option value="inventory">Inventory</Option>
              <Option value="customers">Customers</Option>
            </Select>
            <RangePicker onChange={(dates) => setDateRange(dates)} />
            <Button type="primary">Generate Report</Button>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Sales"
                value={134850}
                prefix="₹"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Orders"
                value={89}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Average Order Value"
                value={1515}
                prefix="₹"
              />
            </Card>
          </Col>
        </Row>

        <Card style={{ marginTop: "24px" }}>
          <Title level={4}>Sales Trend</Title>
          <BarChart width={800} height={300} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </Card>

        <Card style={{ marginTop: "24px" }}>
          <Title level={4}>Top Selling Products</Title>
          <Table columns={columns} dataSource={topProducts} rowKey="id" />
        </Card>
      </div>
    </AdminLayout>
  )
}

export default Reports