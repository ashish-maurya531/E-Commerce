// "use client"

// import { useState, useEffect } from "react"
// import { 
//   Table, 
//   Button, 
//   Space, 
//   Input, 
//   Tag, 
//   Modal, 
//   Form, 
//   Select, 
//   InputNumber, 
//   Upload, 
//   DatePicker, 
//   message,
//   Typography,
//   Tabs
// } from "antd"
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   SearchOutlined,
//   UploadOutlined,
//   ExportOutlined,
//   ImportOutlined,
// } from "@ant-design/icons"
// import AdminLayout from "../components/AdminLayout"
// import moment from "moment"
// import productService from "../../services/product.service"
// import categoryService from "../../services/category.service"

// const { Title } = Typography
// const { Option } = Select
// const { TextArea } = Input

// const Products = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false)
//   const [form] = Form.useForm()
//   const [editingProduct, setEditingProduct] = useState(null)
//   const [products, setProducts] = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(false)

//   // Fetch products on component mount
//   useEffect(() => {
//     fetchProducts()
//     fetchCategories()
//   }, [])

//   // Fetch products from API
//   const fetchProducts = async () => {
//     try {
//       setLoading(true)
//       const data = await productService.getAllProducts()
//       setProducts(data)
//     } catch (error) {
//       message.error("Failed to fetch products")
//       console.error("Error fetching products:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // Fetch categories from API
//   const fetchCategories = async () => {
//     try {    
//       const data = await categoryService.getAllCategories()
//       setCategories(data)
//     } catch (error) {
//       message.error("Failed to fetch categories")
//       console.error("Error fetching categories:", error)
//     }
//   }

//   // Handle add/edit product
//   const handleAddEdit = () => {
//     setEditingProduct(null)
//     form.resetFields()
//     setIsModalVisible(true)
//   }

//   // Handle edit product
//   const handleEdit = (product) => {
//     setEditingProduct(product)
//     form.setFieldsValue({
//       name: product.name,
//       category_id: product.category_id, // Changed from category to category_id
//       price: product.price,
//       stock: product.stock,
//       manufacturer: product.manufacturer,
//       expiry: product.expiry ? moment(product.expiry) : null,
//       status: product.status,
//       description: product.description,
//     })
//     setIsModalVisible(true)
//   }

//   // Handle delete product
//   const handleDelete = (id) => {
//     Modal.confirm({
//       title: "Are you sure you want to delete this product?",
//       content: "This action cannot be undone.",
//       okText: "Yes",
//       okType: "danger",
//       cancelText: "No",
//       onOk: async () => {
//         try {
//           await productService.deleteProduct(id)
//           message.success("Product deleted successfully")
//           fetchProducts() // Refresh the product list
//         } catch (error) {
//           message.error("Failed to delete product")
//           console.error("Error deleting product:", error)
//         }
//       },
//     })
//   }

//   // Handle form submission
//   const handleSubmit = async (values) => {
//     try {
//       if (editingProduct) {
//         await productService.updateProduct(editingProduct.id, values)
//         message.success("Product updated successfully")
//       } else {
//         await productService.createProduct(values)
//         message.success("Product added successfully")
//       }
//       setIsModalVisible(false)
//       fetchProducts() // Refresh the product list
//     } catch (error) {
//       message.error(editingProduct ? "Failed to update product" : "Failed to add product")
//       console.error("Error saving product:", error)
//     }
//   }




//   // Table columns
//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "id",
//       key: "id",
//       sorter: (a, b) => a.id - b.id,
//     },
//     {
//       title: "Product Name",
//       dataIndex: "name",
//       key: "name",
//       sorter: (a, b) => a.name.localeCompare(b.name),
//       render: (text, record) => (
//         <Space>
//           <img
//             src="/placeholder.svg?height=40&width=40"
//             alt={text}
//             style={{ width: 40, height: 40, borderRadius: 4 }}
//           />
//           {text}
//         </Space>
//       ),
//     },
//     {
//       title: "Category",
//       dataIndex: "category",
//       key: "category",
//       filters: categories.map((cat) => ({ text: cat.name, value: cat.id })),
//       onFilter: (value, record) => record.category_id === value,
//     },
//     {
//       title: "Price (₹)",
//       dataIndex: "price",
//       key: "price",
//       sorter: (a, b) => a.price - b.price,
//       render: (price) => `₹${price}`,
//     },
//     {
//       title: "Stock",
//       dataIndex: "stock",
//       key: "stock",
//       sorter: (a, b) => a.stock - b.stock,
//     },
//     {
//       title: "Manufacturer",
//       dataIndex: "manufacturer",
//       key: "manufacturer",
//     },
//     {
//       title: "Expiry Date",
//       dataIndex: "expiry",
//       key: "expiry",
//       sorter: (a, b) => new Date(a.expiry) - new Date(b.expiry),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       key: "status",
//       render: (status) => {
//         let color = ""
//         switch (status) {
//           case "Active":
//             color = "success"
//             break
//           case "Out of Stock":
//             color = "error"
//             break
//           case "Low Stock":
//             color = "warning"
//             break
//           default:
//             color = "default"
//         }
//         return <Tag color={color}>{status}</Tag>
//       },
//       filters: [
//         { text: "Active", value: "Active" },
//         { text: "Out of Stock", value: "Out of Stock" },
//         { text: "Low Stock", value: "Low Stock" },
//       ],
//       onFilter: (value, record) => record.status === value,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Space size="small">
//           <Button type="primary" icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
//           <Button danger icon={<DeleteOutlined />} size="small" onClick={() => handleDelete(record.id)} />
//         </Space>
//       ),
//     },
//   ]

//   return (
//     <AdminLayout>
//       <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
//         <Input.Search 
//           placeholder="Search products" 
//           allowClear 
//           style={{ width: 300 }} 
//           prefix={<SearchOutlined />}
//           onSearch={(value) => {
//             fetchProducts({ search: value })
//           }}
//         />
//         <Space>
//           <Button icon={<ImportOutlined />}>Import</Button>
//           <Button icon={<ExportOutlined />}>Export</Button>
//           <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEdit}>
//             Add Product
//           </Button>
//         </Space>
//       </div>

//       <Table 
//         columns={columns} 
//         dataSource={products} 
//         rowKey="id" 
//         pagination={{ pageSize: 10 }} 
//         scroll={{ x: 1200 }}
//         loading={loading}
//       />

//       {/* Add/Edit Product Modal */}
//       <Modal
//         title={editingProduct ? "Edit Product" : "Add New Product"}
//         visible={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         footer={null}
//         width={800}
//       >
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <Form.Item
//             name="name"
//             label="Product Name"
//             rules={[{ required: true, message: "Please enter product name" }]}
//           >
//             <Input placeholder="Enter product name" />
//           </Form.Item>

//           <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
//             <Select placeholder="Select category">
//               {categories.map((category) => (
//                 <Option key={category.id} value={category.id}>
//                   {category.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="price" label="Price (₹)" rules={[{ required: true, message: "Please enter price" }]}>
//             <InputNumber
//               min={0}
//               placeholder="Enter price"
//               style={{ width: "100%" }}
//               formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
//               parser={(value) => value.replace(/₹\s?|(,*)/g, "")}
//             />
//           </Form.Item> 

//           <Form.Item
//             name="stock"
//             label="Stock Quantity"
//             rules={[{ required: true, message: "Please enter stock quantity" }]}
//           >
//             <InputNumber min={0} placeholder="Enter stock quantity" style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item
//             name="manufacturer"
//             label="Manufacturer"
//             rules={[{ required: true, message: "Please enter manufacturer" }]}
//           >
//             <Input placeholder="Enter manufacturer" />
//           </Form.Item>

//           <Form.Item
//             name="expiry"
//             label="Expiry Date"
//             rules={[{ required: true, message: "Please select expiry date" }]}
//           >
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status" }]}>
//             <Select placeholder="Select status">
//               <Option value="Active">Active</Option>
//               <Option value="Out of Stock">Out of Stock</Option>
//               <Option value="Low Stock">Low Stock</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item name="image" label="Product Image">
//             <Upload listType="picture" maxCount={1} beforeUpload={() => false}>
//               <Button icon={<UploadOutlined />}>Upload Image</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item name="description" label="Description">
//             <Input.TextArea rows={4} placeholder="Enter product description" />
//           </Form.Item>

//           <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
//             <Space>
//               <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 {editingProduct ? "Update" : "Add"} Product
//               </Button>
//             </Space>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </AdminLayout>
//   )
// }

// export default Products


"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Tag, 
  Modal, 
  Form, 
  Select, 
  InputNumber, 
  Upload, 
  message,
  Typography,
  Collapse,
  Row,
  Col,
  Divider
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"
import productService from "../../services/product.service"
import categoryService from "../../services/category.service"

const { Title } = Typography
const { Option } = Select
const { Panel } = Collapse

const Products = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingProduct, setEditingProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      setProducts(data)
    } catch (error) {
      message.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {    
      const data = await categoryService.getAllCategories()
      setCategories(data)
    } catch (error) {
      message.error("Failed to fetch categories")
    }
  }

  const handleAddEdit = () => {
    setEditingProduct(null)
    form.resetFields()
    setFileList([])
    setIsModalVisible(true)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    form.setFieldsValue({
      ...product,
      variants: product.variants.map(v => ({
        ...v,
        price: parseFloat(v.price),
        original_price: parseFloat(v.original_price)
      }))
    })
    setFileList(product.image_url ? [{
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: product.image_url,
    }] : [])
    setIsModalVisible(true)
  }

  const handleDelete = (product_id) => {
    Modal.confirm({
      title: "Delete this product?",
      content: "All variants will be deleted too!",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await productService.deleteProduct(product_id)
          message.success("Product deleted")
          fetchProducts()
        } catch (error) {
          message.error("Delete failed")
        }
      },
    })
  }

  const handleSubmit = async (values) => {
    try {
      console.log('Form Values Before Processing:', values);

      // Ensure variants exist and is an array
      if (!values.variants || !Array.isArray(values.variants)) {
        values.variants = [];
      }

      const formData = {
        name: values.name,
        sku: values.sku,
        category_id: values.category_id,
        status: values.status || 'Active',
        description: values.description || '',
        image: fileList[0]?.originFileObj,
        variants: values.variants.map(variant => ({
          volume: variant.volume,
          pack_size: Number(variant.pack_size),
          stock: Number(variant.stock),
          min_stock: Number(variant.min_stock),
          price: Number(variant.price),
          original_price: Number(variant.original_price)
        }))
      };

      console.log('Processed Form Data:', formData);

      if (editingProduct) {
        await productService.updateProduct(editingProduct.product_id, formData);
      } else {
        await productService.createProduct(formData);
      }
      
      message.success(editingProduct ? "Product updated" : "Product created");
      setIsModalVisible(false);
      form.resetFields();
      fetchProducts();
    } catch (error) {
      console.error('Submission error:', error);
      message.error(editingProduct ? "Update failed" : "Creation failed");
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          {record.image_url && (
            <img 
              src={record.image_url} 
              alt={text}
              className="w-12 h-12 rounded-md object-cover mr-3"
            />
          )}
          <div>
            <div className="font-semibold">{text}</div>
            <div className="text-xs text-gray-500">{record.sku}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      render: (id) => categories.find(c => c.category_id === id)?.name || 'N/A'
    },
    {
      title: 'Variants',
      dataIndex: 'variants',
      render: variants => (
        <div className="space-y-1">
          {variants.map(v => (
            <div key={v.sno} className="text-xs">
              {v.volume} - Pack of {v.pack_size} 
              <Tag color="blue" className="ml-2">₹{v.price}</Tag>
              {v.original_price > v.price && (
                <Tag color="green" className="ml-1">
                  {Math.round(v.discount)}% off
                </Tag>
              )}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status => (
        <Tag color={status === 'Active' ? 'success' : 'error'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.product_id)}
          />
        </Space>
      )
    }
  ]

  return (
    <AdminLayout>
      <div className="flex justify-between mb-4">
        <Input.Search 
          placeholder="Search products..."
          style={{ width: 300 }}
          onSearch={fetchProducts}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddEdit}
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="product_id"
        loading={loading}
        expandable={{
          expandedRowRender: record => (
            <div className="p-4 bg-gray-50">
              <Divider orientation="left">Variants Details</Divider>
              <Row gutter={16}>
                {record.variants.map(variant => (
                  <Col span={8} key={variant.sno} className="mb-4">
                    <div className="p-3 bg-white rounded-lg shadow">
                      <div className="font-medium">
                        {variant.volume} (Pack of {variant.pack_size})
                      </div>
                      <div className="flex items-center mt-2">
                        <div className="mr-4">
                          <span className="text-gray-600">Price: </span>
                          ₹{variant.price}
                        </div>
                        {variant.original_price > variant.price && (
                          <div className="line-through text-gray-400 mr-2">
                            ₹{variant.original_price}
                          </div>
                        )}
                        <Tag color="green" className="mr-2">
                          Stock: {variant.stock}
                        </Tag>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )
        }}
      />

      <Modal
        title={`${editingProduct ? 'Edit' : 'New'} Product`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ variants: [{}] }}
          onFinish={handleSubmit}
        >
          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Product Name"
              name="name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="SKU"
              name="sku"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Category"
              name="category_id"
              rules={[{ required: true }]}
            >
              <Select>
                {categories.map(category => (
                  <Option 
                    key={category.category_id} 
                    value={category.category_id}
                  >
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select>
                <Option value="Active">Active</Option>
                <Option value="Inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          {/* Image Upload */}
          <Form.Item label="Product Image">
            <Upload
              listType="picture-card"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              {fileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div className="mt-2">Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Variants Section */}
          <Divider orientation="left">Product Variants</Divider>
          
          <Form.List name="variants">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Collapse key={key} className="mb-4">
                    <Panel header={`Variant ${key + 1}`}>
                      <div className="grid grid-cols-4 gap-4">
                        <Form.Item
                          {...rest}
                          label="Volume"
                          name={[name, 'volume']}
                          rules={[{ required: true }]}
                        >
                          <Input placeholder="250ml" />
                        </Form.Item>

                        <Form.Item
                          {...rest}
                          label="Pack Size"
                          name={[name, 'pack_size']}
                          initialValue={1}
                        >
                          <InputNumber min={1} />
                        </Form.Item>

                        <Form.Item
                          {...rest}
                          label="Original Price"
                          name={[name, 'original_price']}
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0} className="w-full" />
                        </Form.Item>

                        <Form.Item
                          {...rest}
                          label="Selling Price"
                          name={[name, 'price']}
                          rules={[{ required: true }]}
                        >
                          <InputNumber min={0} className="w-full" />
                        </Form.Item>

                        <Form.Item
                          {...rest}
                          label="Stock"
                          name={[name, 'stock']}
                          initialValue={0}
                        >
                          <InputNumber min={0} />
                        </Form.Item>

                        <Form.Item
                          {...rest}
                          label="Min Stock"
                          name={[name, 'min_stock']}
                          initialValue={10}
                        >
                          <InputNumber min={0} />
                        </Form.Item>

                        <Button
                          danger
                          onClick={() => remove(name)}
                          className="self-end"
                        >
                          Remove Variant
                        </Button>
                      </div>
                    </Panel>
                  </Collapse>
                ))}

                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Variant
                </Button>
              </>
            )}
          </Form.List>

          <div className="mt-6 text-right">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </Form>
      </Modal>
    </AdminLayout>
  )
}

export default Products