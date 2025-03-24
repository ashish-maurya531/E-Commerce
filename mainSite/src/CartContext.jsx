import { createContext, useState, useContext } from "react";

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Function to add items to cart
  const addToCart = (product) => {
    const storedCart = localStorage.getItem("cartItems");
    let cartItems = storedCart ? JSON.parse(storedCart) : [];
  
    const existingItem = cartItems.find((item) => item.id === product.id);
  
    if (existingItem) {
      cartItems = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  
    window.dispatchEvent(new Event("storage"));
  
    message.success(`${product.name} added to cart`);
  };  

  return (
    <CartContext.Provider value={{ cartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => useContext(CartContext);