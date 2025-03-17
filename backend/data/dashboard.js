// Dummy dashboard data
const dashboardData = {
  stats: {
    totalSales: 124350,
    totalOrders: 1243,
    totalProducts: 156,
    totalCustomers: 3254,
  },
  salesData: [
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
  ],
  categoryData: [
    { type: "Antibiotics", value: 35 },
    { type: "Pain Relief", value: 25 },
    { type: "Vitamins & Supplements", value: 15 },
    { type: "Diabetes Care", value: 10 },
    { type: "Cardiovascular", value: 8 },
    { type: "Respiratory", value: 7 },
  ],
  topProducts: [
    {
      title: "Amoxicillin 500mg",
      sales: 245,
      percent: 85,
    },
    {
      title: "Paracetamol 650mg",
      sales: 190,
      percent: 70,
    },
    {
      title: "Vitamin D3 60K",
      sales: 145,
      percent: 55,
    },
    {
      title: "Insulin Glargine",
      sales: 120,
      percent: 45,
    },
    {
      title: "Atorvastatin 10mg",
      sales: 95,
      percent: 35,
    },
  ],
  recentOrders: [
    {
      id: "ORD-12345",
      customer: "Rahul Sharma",
      date: "2023-03-15 14:30",
      amount: 2499,
      status: "Delivered",
    },
    {
      id: "ORD-12346",
      customer: "Priya Mehta",
      date: "2023-03-15 13:45",
      amount: 1899,
      status: "Processing",
    },
    {
      id: "ORD-12347",
      customer: "Ahmed Khan",
      date: "2023-03-15 12:20",
      amount: 3299,
      status: "Shipped",
    },
    {
      id: "ORD-12348",
      customer: "Sneha Patel",
      date: "2023-03-15 11:15",
      amount: 999,
      status: "Pending",
    },
    {
      id: "ORD-12349",
      customer: "Vikram Singh",
      date: "2023-03-15 10:30",
      amount: 1499,
      status: "Delivered",
    },
  ],
}

module.exports = {
  dashboardData,
}

