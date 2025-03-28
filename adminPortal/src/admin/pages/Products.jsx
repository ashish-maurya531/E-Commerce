"use client"

import { useState, useEffect } from "react"
import { Table, Button, Space, Input, Tag, Modal, Form, Select, InputNumber, Upload, DatePicker, message } from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  ExportOutlined,
  ImportOutlined,
} from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"
import moment from "moment"
import productService from "../../services/product.service"

const { Option } = Select

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingProduct, setEditingProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (error) {
      message.error("Failed to fetch products")
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle add/edit product
  const handleAddEdit = () => {
    setEditingProduct(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  // Handle edit product
  const handleEdit = (product) => {
    setEditingProduct(product)
    form.setFieldsValue({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      manufacturer: product.manufacturer,
      expiry: product.expiry ? moment(product.expiry) : null,
      status: product.status,
    })
    setIsModalVisible(true)
  }

  // Handle delete product
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await productService.deleteProduct(id)
          message.success("Product deleted successfully")
          fetchProducts() // Refresh the product list
        } catch (error) {
          message.error("Failed to delete product")
          console.error("Error deleting product:", error)
        }
      },
    })
  }

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, values)
        message.success("Product updated successfully")
      } else {
        await productService.createProduct(values)
        message.success("Product added successfully")
      }
      setIsModalVisible(false)
      fetchProducts() // Refresh the product list
    } catch (error) {
      message.error(editingProduct ? "Failed to update product" : "Failed to add product")
      console.error("Error saving product:", error)
    }
  }

  // // Sample product data
  // const products = [
  //   {
  //     id: 1,
  //     name: "Royal Attar Perfume",
  //     category: "Royal Attar",
  //     price: 899,
  //     stock: 120,
  //     manufacturer: "AdilQadri",
  //     expiry: "2025-12-31",
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Musk Attar",
  //     category: "Attar",
  //     price: 699,
  //     stock: 85,
  //     manufacturer: "AdilQadri",
  //     expiry: "2025-10-15",
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  //     name: "Rose Perfume Spray",
  //     category: "Perfume Spray",
  //     price: 799,
  //     stock: 65,
  //     manufacturer: "AdilQadri",
  //     expiry: "2025-11-20",
  //     status: "Active",
  //   },
  //   {
  //     id: 4,
  //     name: "Oud Bakhoor",
  //     category: "Bakhoor",
  //     price: 1299,
  //     stock: 40,
  //     manufacturer: "AdilQadri",
  //     expiry: "2024-09-30",
  //     status: "Active",
  //   },
  //   {
  //     id: 5,
  //     name: "Premium Diffuser Oil",
  //     category: "Diffuser Oil",
  //     price: 999,
  //     stock: 55,
  //     manufacturer: "AdilQadri",
  //     expiry: "2025-08-15",
  //     status: "Active",
  //   },
  //   {
  //     id: 6,
  //     name: "Luxury Body Spray",
  //     category: "Body Spray",
  //     price: 599,
  //     stock: 0,
  //     manufacturer: "AdilQadri",
  //     expiry: "2025-07-10",
  //     status: "Out of Stock",
  //   },
  //   {
  //     id: 7,
  //     name: "Sandalwood Incense Sticks",
  //     category: "Incense Sticks",
  //     price: 399,
  //     stock: 150,
  //     manufacturer: "AdilQadri",
  //     expiry: "2026-01-20",
  //     status: "Active",
  //   },
  //   {
  //     id: 8,
  //     name: "Special Edition Attar",
  //     category: "Attar",
  //     price: 1499,
  //     stock: 25,
  //     manufacturer: "AdilQadri",
  //     expiry: "2024-12-15",
  //     status: "Low Stock",
  //   },
  // ]

  // Sample categories
  const categories = [
    "Attar",
    "Perfume Spray",
    "Royal Attar",
    "Body Spray",
    "Bakhoor",
    "Incense Sticks",
    "Diffuser Oil",
  ]

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
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
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: categories.map((cat) => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Price (₹)",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      render: (price) => `₹${price}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiry",
      key: "expiry",
      sorter: (a, b) => new Date(a.expiry) - new Date(b.expiry),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = ""
        switch (status) {
          case "Active":
            color = "success"
            break
          case "Out of Stock":
            color = "error"
            break
          case "Low Stock":
            color = "warning"
            break
          default:
            color = "default"
        }
        return <Tag color={color}>{status}</Tag>
      },
      filters: [
        { text: "Active", value: "Active" },
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
          <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
          <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input.Search 
          placeholder="Search products" 
          allowClear 
          style={{ width: 300 }} 
          prefix={<SearchOutlined />}
          onSearch={(value) => {
            fetchProducts({ search: value })
          }}
        />
        <Space>
          <Button icon={<ImportOutlined />}>Import</Button>
          <Button icon={<ExportOutlined />}>Export</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEdit}>
            Add Product
          </Button>
        </Space>
      </div>

      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="id" 
        pagination={{ pageSize: 10 }} 
        scroll={{ x: 1200 }}
        loading={loading}
      />

      {/* Add/Edit Product Modal */}
      <Modal
        title={editingProduct ? "Edit Product" : "Add New Product"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
            <Select placeholder="Select category">
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="price" label="Price (₹)" rules={[{ required: true, message: "Please enter price" }]}>
            <InputNumber
              min={0}
              placeholder="Enter price"
              style={{ width: "100%" }}
              formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
            />
          </Form.Item> 

          <Form.Item
            name="stock"
            label="Stock Quantity"
            rules={[{ required: true, message: "Please enter stock quantity" }]}
          >
            <InputNumber min={0} placeholder="Enter stock quantity" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[{ required: true, message: "Please enter manufacturer" }]}
          >
            <Input placeholder="Enter manufacturer" />
          </Form.Item>

          <Form.Item
            name="expiry"
            label="Expiry Date"
            rules={[{ required: true, message: "Please select expiry date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
            <Select placeholder="Select status">
              <Option value="Active">Active</Option>
              <Option value="Out of Stock">Out of Stock</Option>
              <Option value="Low Stock">Low Stock</Option>
            </Select>
          </Form.Item>

          <Form.Item name="image" label="Product Image">
            <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? "Update" : "Add"} Product
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  )
}

export default Products

