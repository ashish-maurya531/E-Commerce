import { useState, useEffect } from "react";
import { Layout, Typography, Table, Button, InputNumber, Space, Divider, Card, Row, Col, Input, message } from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const { Content } = Layout;
const { Title, Text } = Typography;

const CartPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load cart from localStorage when page opens
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  // Remove item
  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart)); 
    window.dispatchEvent(new Event("storage"));
    message.success("Item removed from cart");
  };

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 99 : 0;
  const total = subtotal + shipping;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Content style={{ padding: "50px", background: "#f9f9f0" }}>
        <div style={{ background: "#fff", padding: "24px", borderRadius: "2px" }}>
          <Title level={2}>Shopping Cart</Title>

          {cartItems.length > 0 ? (
            <>
              <Table
                columns={[
                  {
                    title: "Product",
                    dataIndex: "name",
                    key: "name",
                    render: (text, record) => (
                      <Space>
                        <img src={record.image} alt={text} style={{ width: 80, height: 80, objectFit: "cover" }} />
                        <Link to={`/product/${record.id}`}>{text}</Link>
                      </Space>
                    ),
                  },
                  { title: "Price", dataIndex: "price", key: "price", render: (price) => `₹${price}` },
                  {
                    title: "Quantity",
                    dataIndex: "quantity",
                    key: "quantity",
                    render: (quantity, record) => (
                      <InputNumber min={1} max={10} value={quantity} onChange={(value) => updateQuantity(record.id, value)} />
                    ),
                  },
                  { title: "Total", key: "total", render: (_, record) => `₹${record.price * record.quantity}` },
                  {
                    title: "Action",
                    key: "action",
                    render: (_, record) => (
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeItem(record.id)} />
                    ),
                  },
                ]}
                dataSource={cartItems}
                pagination={false}
                rowKey="id"
              />

              <Row gutter={24} style={{ marginTop: "30px" }}>
                <Col xs={24} md={16}>
                  <Card title="Have a Coupon?">
                    <Space>
                      <Input placeholder="Enter coupon code" />
                      <Button type="primary">Apply</Button>
                    </Space>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card title="Order Summary">
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <Text>Subtotal</Text>
                      <Text>₹{subtotal}</Text>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                      <Text>Shipping</Text>
                      <Text>₹{shipping}</Text>
                    </div>
                    <Divider />
                    <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                      <Text strong>Total</Text>
                      <Text strong>₹{total}</Text>
                    </div>
                    <Button type="primary" block style={{ marginTop: "20px" }} size="large" href="/checkout">
                      Proceed to Checkout
                    </Button>
                    <Button block style={{ marginTop: "10px" }} href="/">
                      Continue Shopping
                    </Button>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "50px 0" }}>
              <ShoppingOutlined style={{ fontSize: "64px", color: "#ccc", marginBottom: "20px" }} />
              <Title level={3}>Your cart is empty</Title>
              <Text>Looks like you haven't added anything to your cart yet.</Text>
              <div style={{ marginTop: "20px" }}>
                <Button type="primary" size="large" href="/">
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default CartPage;