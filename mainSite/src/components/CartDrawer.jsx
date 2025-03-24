import { useState, useEffect } from "react";
import { Drawer, List, Button, Badge, message, InputNumber } from "antd";
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "../styles/CartDrawer.css"; // Make sure to import the new CSS

const CartDrawer = () => {
  const [cartItems, setCartItems] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const savedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(savedCart);
    };

    updateCart();
    window.addEventListener("storage", updateCart);

    return () => {
      window.removeEventListener("storage", updateCart);
    };
  }, []);

  const toggleDrawer = () => setVisible(!visible);

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
    message.success("Item removed from cart");
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <Badge count={totalQuantity} showZero>
        <ShoppingCartOutlined
          style={{ fontSize: "24px", cursor: "pointer", color: "#000" }}
          onClick={toggleDrawer}
        />
      </Badge>

      <Drawer
        title="Your Cart"
        placement="right"
        closable
        onClose={toggleDrawer}
        open={visible}
        width={350}
      >
        {cartItems.length > 0 ? (
          <>
            <List
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item className="cart-item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{item.price} x {item.quantity}</div>
                  </div>
                  <InputNumber
                    min={1}
                    max={10}
                    value={item.quantity}
                    className="cart-quantity"
                    onChange={(value) => updateQuantity(item.id, value)}
                  />
                  <button
                    className="cart-remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    <DeleteOutlined />
                  </button>
                </List.Item>
              )}
            />

            <div className="cart-total">Total: ₹{totalPrice}</div>

            <div className="cart-buttons">
              <Button type="primary" block onClick={() => setVisible(false)}>
                Continue Shopping
              </Button>
              <Link to="/cart">
                <Button type="default" block>
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <p style={{ textAlign: "center" }}>Your cart is empty.</p>
        )}
      </Drawer>
    </>
  );
};

export default CartDrawer;
