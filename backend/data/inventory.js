// Dummy inventory transactions data
const inventoryTransactions = [
  {
    id: 1,
    product_id: 1,
    user_id: 1,
    transaction_type: "Addition",
    quantity_change: 50,
    transaction_date: "2023-03-10 14:30",
    remarks: "Restocked from supplier",
  },
  {
    id: 2,
    product_id: 1,
    user_id: 1,
    transaction_type: "Subtraction",
    quantity_change: 10,
    transaction_date: "2023-03-05 10:15",
    remarks: "Order fulfillment",
  },
  {
    id: 3,
    product_id: 1,
    user_id: 1,
    transaction_type: "Addition",
    quantity_change: 80,
    transaction_date: "2023-03-01 09:45",
    remarks: "Initial stock",
  },
  {
    id: 4,
    product_id: 2,
    user_id: 1,
    transaction_type: "Addition",
    quantity_change: 100,
    transaction_date: "2023-03-12 11:30",
    remarks: "Restocked from supplier",
  },
  {
    id: 5,
    product_id: 2,
    user_id: 1,
    transaction_type: "Subtraction",
    quantity_change: 15,
    transaction_date: "2023-03-08 14:20",
    remarks: "Order fulfillment",
  },
  {
    id: 6,
    product_id: 3,
    user_id: 1,
    transaction_type: "Addition",
    quantity_change: 75,
    transaction_date: "2023-03-08 10:00",
    remarks: "Restocked from supplier",
  },
  {
    id: 7,
    product_id: 3,
    user_id: 1,
    transaction_type: "Subtraction",
    quantity_change: 10,
    transaction_date: "2023-03-10 16:45",
    remarks: "Order fulfillment",
  },
]

module.exports = {
  inventoryTransactions,
}

