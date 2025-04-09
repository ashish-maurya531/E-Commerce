"use client"

import { useState, useEffect } from "react"
import { 
  Table, 
  Button, 
  Space, 
  Input, 
  Tag, 
  Modal, 
  Image,
  Form, 
  Select, 
  InputNumber, 
  Upload, 
  message,
  Typography,
  Tabs
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined
} from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"
import productService from "../../services/product.service"
import categoryService from "../../services/category.service"

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAllCategories()
      console.log('Fetched categories:', data) // For debugging
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      message.error('Failed to fetch categories')
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      console.log('Fetched products:', data) // For debugging
      setProducts(data)
    } catch (error) {      
      message.error("Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  const handleAddEdit = () => {
    setEditingProduct(null)
    form.resetFields()
    setFileList([])
    setIsModalVisible(true)
  }

  const handleEdit = (record) => {
    try {
      console.log('Editing product:', record);
      setEditingProduct(record);
      
      // Safely parse JSON strings or use empty arrays as fallback
      const parseJsonSafely = (jsonString) => {
        try {
          if (!jsonString) return [];
          return typeof jsonString === 'string' ? JSON.parse(jsonString) : 
                 Array.isArray(jsonString) ? jsonString : [];
        } catch (error) {
          console.warn('Error parsing JSON:', error);
          return [];
        }
      };
  
      // Parse all array fields
      const benefits = parseJsonSafely(record.benefits);
      const features = parseJsonSafely(record.features);
      const specifications = parseJsonSafely(record.specifications);
      const related_products = parseJsonSafely(record.related_products);
  
      // Set all form fields with proper defaults
      const formData = {
        name: record.name || '',
        category_id: record.category_id,
        sku: record.sku || '',
        description_en: record.description_en || '',
        description_hi: record.description_hi || '',
        short_description_en: record.short_description_en || '',
        short_description_hi: record.short_description_hi || '',
        benefits: benefits,
        features: features,
        specifications: specifications,
        related_products: related_products,
        dosage_en: record.dosage_en || '',
        dosage_hi: record.dosage_hi || '',
        mrp: record.mrp || 0,
        dp: record.dp || 0,
        pv: record.pv || 0,
        price: record.price || 0,
        stock: record.stock || 0,
        min_stock: record.min_stock || 10,
        size: record.size || '',
        status: record.status || 'Active',
        original_price: record.original_price || 0,
        discount_percentage: record.discount_percentage || 0
      };
  
      console.log('Setting form data:', formData);
      
      // Reset form and set values
      form.resetFields();
      
      // Make sure the form is reset before setting values
      setTimeout(() => {
        form.setFieldsValue(formData);
        
        // Handle images
        if (record.images) {
          try {
            const imageList = typeof record.images === 'string' 
              ? JSON.parse(record.images) 
              : Array.isArray(record.images) 
                ? record.images 
                : [];
                
            setFileList(
              imageList.map((url, index) => ({
                uid: `-${index}`,
                name: url.split('/').pop(),
                status: 'done',
                url: url.startsWith('http') ? url : `http://localhost:9000${url}`,
                response: { path: url }
              }))
            );
          } catch (error) {
            console.error('Error parsing images:', error);
            setFileList([]);
          }
        } else {
          setFileList([]);
        }
      }, 100);
      
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      message.error('Failed to open edit modal');
    }
  };
  const formItems = [
    {
      name: 'name',
      label: 'Product Name',
      rules: [{ required: true, message: 'Please enter product name' }],
      component: <Input />
    },
    {
      name: 'category_id',
      label: 'Category',
      rules: [{ required: true, message: 'Please select category' }],
      component: (
        <Select>
          {categories.map(cat => (
            <Option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      )
    },
    {
      name: 'sku',
      label: 'SKU',
      component: <Input />
    },
    {
      name: 'description_en',
      label: 'Description (English)',
      component: <TextArea rows={4} />
    },
    {
      name: 'description_hi',
      label: 'Description (Hindi)',
      component: <TextArea rows={4} />
    },
    {
      name: 'short_description_en',
      label: 'Short Description (English)',
      component: <TextArea rows={2} />
    },
    {
      name: 'short_description_hi',
      label: 'Short Description (Hindi)',
      component: <TextArea rows={2} />
    },
    {
      name: 'benefits',
      label: 'Benefits',
      component: <Form.List name="benefits">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item {...restField} name={[name, 'en']} rules={[{ required: true, message: 'Missing benefit in English' }]}>
                  <Input placeholder="Benefit in English" />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'hi']} rules={[{ required: true, message: 'Missing benefit in Hindi' }]}>
                  <Input placeholder="Benefit in Hindi" />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Benefit
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    },
    {
      name: 'dosage_en',
      label: 'Dosage (English)',
      component: <TextArea rows={2} />
    },
    {
      name: 'dosage_hi',
      label: 'Dosage (Hindi)',
      component: <TextArea rows={2} />
    },
    {
      name: 'mrp',
      label: 'MRP',
      component: <InputNumber min={0} />
    },
    {
      name: 'dp',
      label: 'DP',
      component: <InputNumber min={0} />
    },
    {
      name: 'pv',
      label: 'PV',
      component: <InputNumber min={0} />
    },
    {
      name: 'price',
      label: 'Price',
      component: <InputNumber min={0} />
    },
    {
      name: 'original_price',
      label: 'Original Price',
      component: <InputNumber min={0} />
    },
    {
      name: 'discount_percentage',
      label: 'Discount %',
      component: <InputNumber min={0} max={100} />
    },
    {
      name: 'stock',
      label: 'Stock',
      component: <InputNumber min={0} />
    },
    {
      name: 'min_stock',
      label: 'Minimum Stock',
      component: <InputNumber min={0} defaultValue={10} />
    },
    {
      name: 'size',
      label: 'Size',
      component: <Input />
    },
    {
      name: 'features',
      label: 'Features',
      component: <Form.List name="features">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item {...restField} name={[name, 'title']} rules={[{ required: true, message: 'Missing title' }]}>
                  <Input placeholder="Feature Title" />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'description']} rules={[{ required: true, message: 'Missing description' }]}>
                  <Input placeholder="Feature Description" />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Feature
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    },
    {
      name: 'specifications',
      label: 'Specifications',
      component: <Form.List name="specifications">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Missing name' }]}>
                  <Input placeholder="Specification Name" />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: 'Missing value' }]}>
                  <Input placeholder="Specification Value" />
                </Form.Item>
                <DeleteOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Specification
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    },
    {
      name: 'status',
      label: 'Status',
      rules: [{ required: true, message: 'Please select status' }],
      component: (
        <Select defaultValue="Active">
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      )
    }
  ]

  const getExistingImages = () => {
    return fileList
      .filter(file => file.response?.path)
      .map(file => file.response.path);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      // Ensure all required fields are included with default value
      const requiredFields = {
        name: values.name,
        category_id: values.category_id,
        sku: values.sku || '',
        mrp: values.mrp || 0,
        price: values.price || 0,
        dp: values.dp || 0,
        pv: values.pv || 0,
        stock: values.stock || 0,
        min_stock: values.min_stock || 10,
        size: values.size || '',
        status: values.status || 'Active', // Default to 'Active' if undefined
      };
  
      // Add all required fields to formData
      Object.keys(requiredFields).forEach(key => {
        formData.append(key, requiredFields[key]);
      });
  
      // Handle JSON fields properly - stringify them without escaping
      const jsonFields = {
        benefits: values.benefits || [],
        features: values.features || [],
        specifications: values.specifications || [],
        related_products: values.related_products?.map(item => ({
          product_id: item.product_id,
          name: products.find(p => p.product_id === item.product_id)?.name || ''
        })) || []
      };
  
      // Add JSON fields to formData with proper formatting
      Object.keys(jsonFields).forEach(key => {
        formData.append(key, JSON.stringify(jsonFields[key]));
      });
  
      // Add optional fields if they exist
      const optionalFields = {
        description_en: values.description_en || '',
        description_hi: values.description_hi || '',
        short_description_en: values.short_description_en || '',
        short_description_hi: values.short_description_hi || '',
        dosage_en: values.dosage_en || '',
        dosage_hi: values.dosage_hi || '',
        original_price: values.original_price || 0,
        discount_percentage: values.discount_percentage || 0
      };
  
      // Add optional fields to formData
      Object.keys(optionalFields).forEach(key => {
        formData.append(key, optionalFields[key]);
      });
  
      // Handle images - both new and existing
      const existingImages = getExistingImages();
      const newImages = fileList.filter(file => file.originFileObj);

      // Add existing images to formData
      formData.append('existing_images', JSON.stringify(existingImages));

      // Add new images to formData
      newImages.forEach(file => {
        formData.append('images', file.originFileObj);
      });
  
      // Log the data being sent (for debugging)
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
  
      if (editingProduct) {
        await productService.updateProduct(editingProduct.product_id, formData);
        message.success('Product updated successfully');
      } else {
        await productService.createProduct(formData);
        message.success('Product created successfully');
      }
  
      setIsModalVisible(false);
      form.resetFields();
      setFileList([]);
      fetchProducts();
    } catch (error) {
      console.error('Operation failed:', error);
      message.error('Operation failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await productService.deleteProduct(id);
      message.success("Product deleted successfully");
      fetchProducts();
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'S.No',
      key: 'index',
      width: 80,
      render: (_, __, index) => index + 1,
      sorter: (a, b) => a.sno - b.sno,
    },
    {
      title: 'Image',
      dataIndex: 'images',
      key: 'images',
      render: (images) => {
        const imageList = images ? (Array.isArray(images) ? images : JSON.parse(images)) : [];
        return imageList.length > 0 ? (
          <Image
            src={`http://localhost:9000${imageList[0]}`} 
            alt="Product" 
            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '50px', height: '50px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No image
          </div>
        );
      }
    },
    {
      title: 'Product Name',
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterSearch: true,
      filters: [...new Set(products.map(p => ({ text: p.name, value: p.name })))],
      onFilter: (value, record) => record.name.includes(value),
    },
    {
      title: 'Category',
      key: 'category',
      render: (record) => (
        <Tag color="blue">
          {record.category_name || 'N/A'}
        </Tag>
      ),
      sorter: (a, b) => (a.category_name || '').localeCompare(b.category_name || ''),
      filters: categories.map(cat => ({
        text: cat.name,
        value: cat.category_id
      })),
      onFilter: (value, record) => record.category_id === value,
    },
    {
      title: 'SKU',
      dataIndex: "sku",
      key: "sku",
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: "Price Details",
      key: "price",
      render: (_, record) => (
        <div>
          <div>MRP: ₹{record.mrp}</div>
          <div>Price: ₹{record.price}</div>
          <div>DP: ₹{record.dp}</div>
          <div>PV: {record.pv}</div>
          {record.discount_percentage > 0 && (
            <Tag color="green">{record.discount_percentage}% off</Tag>
          )}
        </div>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: (a, b) => a.stock - b.stock,
      render: (stock, record) => (
        <div>
          <div>{stock} units</div>
          {stock <= record.min_stock && (
            <Tag color="warning">Low Stock</Tag>
          )}
        </div>
      ),
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      sorter: (a, b) => a.size.localeCompare(b.size),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: rating => `${rating} ⭐`,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: status => (
        <Tag color={status === 'Active' ? 'success' : status === 'Inactive' ? 'error' : 'warning'}>
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
        { text: 'Out of Stock', value: 'Out of Stock' }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          />
          <Button 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => setDeleteConfirmation(record)}
          />
        </Space>
      ),
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
        onChange={(pagination, filters, sorter) => {
          console.log('Table params:', { pagination, filters, sorter });
        }}
        pagination={{
          total: products.length,
          showTotal: (total) => `Total ${total} products`,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false)
          setEditingProduct(null)
          form.resetFields()
          setFileList([])
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Tabs
            items={[
              {
                key: '1',
                label: 'Basic Info',
                children: (
                  <>
                    <Form.Item
                      name="name"
                      label="Product Name"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="category_id"
                      label="Category"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        {categories.map(cat => (
                          <Option key={cat.category_id} value={cat.category_id}>
                            {cat.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="sku"
                      label="SKU"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                    
                    <Form.Item
                      name="size"
                      label="Size"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="e.g. 90 Tab or 250 gm" />
                    </Form.Item>

                    <Form.Item label="Images">
                      <Upload
                        listType="picture-card"
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false}
                      >
                        {fileList.length < 5 && (
                          <div>
                            <PlusOutlined />
                            <div className="mt-2">Upload</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </>
                ),
              },
              {
                key: '2',
                label: 'Descriptions',
                children: (
                  <>
                    <Form.Item
                      name="description_en"
                      label="Description (English)"
                    >
                      <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                      name="description_hi"
                      label="Description (Hindi)"
                    >
                      <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                      name="short_description_en"
                      label="Short Description (English)"
                    >
                      <TextArea rows={2} />
                    </Form.Item>

                    <Form.Item
                      name="short_description_hi"
                      label="Short Description (Hindi)"
                    >
                      <TextArea rows={2} />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: '3',
                label: 'Pricing',
                children: (
                  <>
                    <Form.Item
                      name="mrp"
                      label="MRP"
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        min={0}
                        className="w-full"
                        formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/₹\s?|(,*)/g, '')}
                      />
                    </Form.Item>

                    <Form.Item
                      name="price"
                      label="Selling Price"
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        min={0}
                        className="w-full"
                        formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => value.replace(/₹\s?|(,*)/g, '')}
                      />
                    </Form.Item>

                    <Form.Item
                      name="dp"
                      label="Distributor Price"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="pv"
                      label="Point Value"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: '4',
                label: 'Stock',
                children: (
                  <>
                    <Form.Item
                      name="stock"
                      label="Current Stock"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="min_stock"
                      label="Minimum Stock"
                      rules={[{ required: true }]}
                    >
                      <InputNumber min={0} className="w-full" />
                    </Form.Item>

                    <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                        <Option value="Out of Stock">Out of Stock</Option>
                      </Select>
                    </Form.Item>
                  </>
                ),
              },
              {
                key: '5',
                label: 'Benefits & Features',
                children: (
                  <>
                    <Form.List name="benefits">
                      {(fields, { add, remove }) => (
                        <>
                          <Title level={5}>Benefits</Title>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item {...restField} name={[name, 'en']} rules={[{ required: true, message: 'Required' }]}>
                                <Input placeholder="Benefit in English" />
                              </Form.Item>
                              <Form.Item {...restField} name={[name, 'hi']} rules={[{ required: true, message: 'Required' }]}>
                                <Input placeholder="लाभ हिंदी में" />
                              </Form.Item>
                              <DeleteOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Benefit
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Form.List name="features">
                      {(fields, { add, remove }) => (
                        <>
                          <Title level={5} className="mt-4">Features</Title>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item {...restField} name={[name, 'title']} rules={[{ required: true, message: 'Required' }]}>
                                <Input placeholder="Feature Title" />
                              </Form.Item>
                              <Form.Item {...restField} name={[name, 'description']} rules={[{ required: true, message: 'Required' }]}>
                                <Input placeholder="Feature Description" />
                              </Form.Item>
                              <DeleteOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Feature
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </>
                ),
              },
              {
                key: '6',
                label: 'Specifications & Dosage',
                children: (
                  <>
                    <Form.List name="specifications">
                      {(fields, { add, remove }) => (
                        <>
                          <Title level={5}>Specifications</Title>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true, message: 'Required' }]}>
                                <Input placeholder="Specification Name" />
                              </Form.Item>
                              <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: 'Required' }]}>
                                <Input placeholder="Specification Value" />
                              </Form.Item>
                              <DeleteOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Specification
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Title level={5} className="mt-4">Dosage</Title>
                    <Form.Item name="dosage_en" label="Dosage (English)">
                      <TextArea rows={2} placeholder="e.g., Take 1 tablet twice daily after meals" />
                    </Form.Item>
                    <Form.Item name="dosage_hi" label="Dosage (Hindi)">
                      <TextArea rows={2} placeholder="e.g., भोजन के बाद दिन में दो बार 1 टैबलेट लें" />
                    </Form.Item>
                  </>
                ),
              },
              {
                key: '7',
                label: 'Related Products',
                children: (
                  <>
                    <Title level={5}>Related Products</Title>
                    <Form.List name="related_products">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                              <Form.Item
                                {...restField}
                                name={[name, 'product_id']}
                                rules={[{ required: true, message: 'Please select a product' }]}
                              >
                                <Select
                                  showSearch
                                  placeholder="Select a product"
                                  optionFilterProp="children"
                                  style={{ width: 300 }}
                                >
                                  {products.filter(p => p.product_id !== editingProduct?.product_id).map(product => (
                                    <Option key={product.product_id} value={product.product_id}>
                                      {product.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <DeleteOutlined onClick={() => remove(name)} />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                              Add Related Product
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </>
                ),
              }
            ]}
          />

          <div className="text-right mt-4">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
            {/* Delete Confirmation Modal */}

          </div>
        </Form>
      </Modal>
      {deleteConfirmation && (
  <Modal
    title="Delete Product"
    open={!!deleteConfirmation}
    onOk={() => handleDelete(deleteConfirmation.product_id)}
    onCancel={() => setDeleteConfirmation(null)}
    okText="Yes, Delete"
    cancelText="No, Cancel"
    okButtonProps={{ danger: true }}
  >
    Are you sure you want to delete the product "{deleteConfirmation.name}"? 
    This action cannot be undone.
  </Modal>
)}
    </AdminLayout>
  )
}

export default Products