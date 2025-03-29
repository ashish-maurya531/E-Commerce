// // import { useState, useEffect } from "react"
// // import {
// //   Table,
// //   Button,
// //   Space,
// //   Modal,
// //   Form,
// //   Input,
// //   message,
// //   Typography,
// //   Upload,
// //   Image
// // } from "antd"
// // import {
// //   PlusOutlined,
// //   EditOutlined,
// //   DeleteOutlined,
// //   UploadOutlined,
// // } from "@ant-design/icons"
// // import AdminLayout from "../components/AdminLayout"
// // import categoryService from "../../services/category.service"
// // import imageService from '../../services/image.service';

// // const { Title } = Typography
// // const { TextArea } = Input

// // const Categories = () => {
// //   const [isModalVisible, setIsModalVisible] = useState(false)
// //   const [form] = Form.useForm()
// //   const [editingCategory, setEditingCategory] = useState(null)
// //   const [categories, setCategories] = useState([])
// //   const [loading, setLoading] = useState(false)

// //   // Fetch categories on component mount
// //   useEffect(() => {
// //     fetchCategories()
// //   }, [])

// //   const fetchCategories = async () => {
// //     try {
// //       setLoading(true)
// //       const data = await categoryService.getAllCategories()
// //       setCategories(data)
// //     } catch (error) {
// //       message.error("Failed to fetch categories")
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const handleCreate = async (values) => {
// //     try {
// //       const formData = new FormData();
// //       formData.append("name", values.name);
// //       formData.append("description", values.description);
// //       if (values.image && values.image[0]?.originFileObj) {
// //         formData.append("image", values.image[0].originFileObj);
// //       }

// //       await categoryService.createCategory(formData);
// //       message.success("Category created successfully");
// //       setIsModalVisible(false);
// //       form.resetFields();
// //       fetchCategories();
// //     } catch (error) {
// //       console.error('Failed to create category:', error);
// //       message.error("Failed to create category");
// //     }
// //   };

// //   const handleUpdate = async (values) => {
// //     try {
// //       const formData = new FormData();
// //       formData.append("name", values.name.trim());
// //       formData.append("description", values.description?.trim() || '');
      
// //       if (values.image && values.image[0]?.originFileObj) {
// //         formData.append("image", values.image[0].originFileObj);
// //       }

// //       await categoryService.updateCategory(
// //         editingCategory.category_id, 
// //         formData
// //       );
      
// //       message.success("Category updated successfully");
// //       setIsModalVisible(false);
// //       form.resetFields();
// //       fetchCategories();
// //     } catch (error) {
// //       console.error('Failed to update category:', error);
// //       message.error(error.response?.data?.message || "Failed to update category");
// //     }
// //   };

// //   // Replace the form's onFinish prop with this
// //   const onFinish = (values) => {
// //     if (editingCategory) {
// //       handleUpdate(values);
// //     } else {
// //       handleCreate(values);
// //     }
// //   };

// //   const handleDelete = async (id) => {
// //     try {
// //       setLoading(true);
// //       await categoryService.deleteCategory(id);
// //       message.success("Category deleted successfully");
// //       fetchCategories();
// //     } catch (error) {
// //       console.error('Delete error:', error);
// //       message.error(error.response?.data?.message || "Failed to delete category");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// //   const columns = [
// //     {
// //       title: "Image",
// //       dataIndex: "image_url",
// //       key: "image",
// //       render: (image_url) => (
// //         image_url ? (
// //           <Image 
// //             src={`http://localhost:5000${image_url}`}
// //             alt="Category" 
// //             width={50} 
// //             height={50}
// //             style={{ objectFit: 'cover' }}
// //           />
// //         ) : (
// //           <div style={{ 
// //             width: 50, 
// //             height: 50, 
// //             background: '#f5f5f5', 
// //             display: 'flex', 
// //             alignItems: 'center', 
// //             justifyContent: 'center',
// //             color: '#999' 
// //           }}>
// //             No Image
// //           </div>
// //         )
// //       ),
// //     },
// //     {
// //       title: "Name",
// //       dataIndex: "name",
// //       key: "name",
// //       sorter: (a, b) => a.name.localeCompare(b.name),
// //     },
// //     {
// //       title: "Description",
// //       dataIndex: "description",
// //       key: "description",
// //     },
// //     {
// //       title: "Products Count",
// //       dataIndex: "products_count", // Changed from category_products_count
// //       key: "productsCount",
// //       sorter: (a, b) => (a.products_count || 0) - (b.products_count || 0), // Added null check
// //     },
// //     // Update the Delete button in columns definition
// //     {
// //       title: "Action",
// //       key: "action",
// //       render: (_, record) => (
// //         <Space>
// //           <Button
// //             icon={<EditOutlined />}
// //             onClick={() => {
// //               setEditingCategory(record);
// //               form.setFieldsValue({
// //                 name: record.name,
// //                 description: record.description,
// //               });
// //               setIsModalVisible(true);
// //             }}
// //           />
// //          <Button
// //   danger
// //   icon={<DeleteOutlined />}
// //   onClick={() => {
// //     console.log('Delete button clicked');
// //     console.log('Record details:', record);
    
// //     Modal.confirm({
// //       title: "Delete Category",
// //       content: "Are you sure you want to delete this category? This action cannot be undone.",
// //       okText: "Yes, delete",
// //       okType: "danger",
// //       cancelText: "No",
// //       centered: true,
// //       onOk() {
// //         console.log('Modal OK clicked');
// //         handleDelete(record.category_id);
// //       },
// //       onCancel() {
// //         console.log('Modal canceled');
// //       }
// //     });
// //   }}
// // />
// //         </Space>
// //       ),
// //     },
// //   ]

// //   return (
// //     <AdminLayout>
// //       <div style={{ padding: "24px" }}>
// //         <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
// //           <Title level={2}>Category Management</Title>
// //           <Button
// //             type="primary"
// //             icon={<PlusOutlined />}
// //             onClick={() => {
// //               setEditingCategory(null)
// //               form.resetFields()
// //               setIsModalVisible(true)
// //             }}
// //           >
// //             Add Category
// //           </Button>
// //         </div>

// //         <Table 
// //           columns={columns} 
// //           dataSource={categories} 
// //           rowKey="category_id"  // Changed from "id" to "category_id"
// //           loading={loading}
// //         />

// //         <Modal
// //           title={editingCategory ? "Edit Category" : "Add New Category"}
// //           open={isModalVisible}
// //           onCancel={() => {
// //             setIsModalVisible(false)
// //             form.resetFields()
// //           }}
// //           footer={null}
// //         >
// //           <Form
// //             form={form}
// //             layout="vertical"
// //             onFinish={onFinish}  // Updated this line
// //           >
// //             <Form.Item
// //               name="name"
// //               label="Category Name"
// //               rules={[{ required: true, message: "Please enter category name" }]}
// //             >
// //               <Input placeholder="Enter category name" />
// //             </Form.Item>

// //             <Form.Item
// //               name="description"
// //               label="Description"
// //               rules={[{ required: true, message: "Please enter description" }]}
// //             >
// //               <TextArea rows={4} placeholder="Enter category description" />
// //             </Form.Item>

// //             <Form.Item
// //               name="image"
// //               label="Category Image"
// //               valuePropName="fileList"
// //               getValueFromEvent={(e) => {
// //                 if (Array.isArray(e)) {
// //                   return e;
// //                 }
// //                 return e?.fileList?.slice(-1); // Only keep the last uploaded file
// //               }}
// //             >
// //               <Upload
// //                 accept="image/*"
// //                 listType="picture-card"
// //                 maxCount={1} // Allow only one image
// //                 beforeUpload={() => false} // Prevent auto upload
// //               >
// //                 <div>
// //                   <PlusOutlined />
// //                   <div style={{ marginTop: 8 }}>Upload</div>
// //                 </div>
// //               </Upload>
// //             </Form.Item>

// //             <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
// //               <Space>
// //                 <Button onClick={() => {
// //                   setIsModalVisible(false)
// //                   form.resetFields()
// //                 }}>
// //                   Cancel
// //                 </Button>
// //                 <Button type="primary" htmlType="submit">
// //                   {editingCategory ? "Update" : "Create"}
// //                 </Button>
// //               </Space>
// //             </Form.Item>
// //           </Form>
// //         </Modal>
// //       </div>
// //     </AdminLayout>
// //   )
// // }

// // export default Categories





// import { useState, useEffect } from "react"
// import {
//   Table,
//   Button,
//   Space,
//   Modal,
//   Form,
//   Input,
//   message,
//   Typography,
//   Upload,
//   Image,
//   ConfigProvider
// } from "antd"
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
//   UploadOutlined,
// } from "@ant-design/icons"
// import AdminLayout from "../components/AdminLayout"
// import categoryService from "../../services/category.service"
// import imageService from '../../services/image.service';

// const { Title } = Typography
// const { TextArea } = Input

// const Categories = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false)
//   const [form] = Form.useForm()
//   const [editingCategory, setEditingCategory] = useState(null)
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(false)

//   // Fetch categories on component mount
//   useEffect(() => {
//     fetchCategories()
//   }, [])

//   const fetchCategories = async () => {
//     try {
//       setLoading(true)
//       const data = await categoryService.getAllCategories()
//       setCategories(data)
//     } catch (error) {
//       message.error("Failed to fetch categories")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleCreate = async (values) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", values.name);
//       formData.append("description", values.description);
//       if (values.image && values.image[0]?.originFileObj) {
//         formData.append("image", values.image[0].originFileObj);
//       }

//       await categoryService.createCategory(formData);
//       message.success("Category created successfully");
//       setIsModalVisible(false);
//       form.resetFields();
//       fetchCategories();
//     } catch (error) {
//       console.error('Failed to create category:', error);
//       message.error("Failed to create category");
//     }
//   };

//   const handleUpdate = async (values) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", values.name.trim());
//       formData.append("description", values.description?.trim() || '');
      
//       if (values.image && values.image[0]?.originFileObj) {
//         formData.append("image", values.image[0].originFileObj);
//       }

//       await categoryService.updateCategory(
//         editingCategory.category_id, 
//         formData
//       );
      
//       message.success("Category updated successfully");
//       setIsModalVisible(false);
//       form.resetFields();
//       fetchCategories();
//     } catch (error) {
//       console.error('Failed to update category:', error);
//       message.error(error.response?.data?.message || "Failed to update category");
//     }
//   };

//   // Replace the form's onFinish prop with this
//   const onFinish = (values) => {
//     if (editingCategory) {
//       handleUpdate(values);
//     } else {
//       handleCreate(values);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       console.log('Attempting to delete category with ID:', id);
//       setLoading(true);
//       const response = await categoryService.deleteCategory(id);
//       message.success(response.message || "Category deleted successfully");
//       fetchCategories();
//     } catch (error) {
//       console.error('Delete error:', error);
//       message.error(error.response?.data?.message || "Failed to delete category");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const columns = [
//     {
//       title: "Image",
//       dataIndex: "image_url",
//       key: "image",
//       render: (image_url) => (
//         image_url ? (
//           <Image 
//             src={`http://localhost:5000${image_url}`}
//             alt="Category" 
//             width={50} 
//             height={50}
//             style={{ objectFit: 'cover' }}
//           />
//         ) : (
//           <div style={{ 
//             width: 50, 
//             height: 50, 
//             background: '#f5f5f5', 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             color: '#999' 
//           }}>
//             No Image
//           </div>
//         )
//       ),
//     },
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       sorter: (a, b) => a.name.localeCompare(b.name),
//     },
//     {
//       title: "Description",
//       dataIndex: "description",
//       key: "description",
//     },
//     {
//       title: "Products Count",
//       dataIndex: "products_count",
//       key: "productsCount",
//       sorter: (a, b) => (a.products_count || 0) - (b.products_count || 0),
//     },
//     {
//       title: "Action",
//       key: "action",
//       render: (_, record) => (
//         <Space>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => {
//               setEditingCategory(record);
//               form.setFieldsValue({
//                 name: record.name,
//                 description: record.description,
//               });
//               setIsModalVisible(true);
//             }}
//           />
//           <Button
//             danger
//             icon={<DeleteOutlined />}
//             onClick={() => {
//               console.log('Delete button clicked');
//               console.log('Record:', record);
//               console.log('Modal object:', Modal);

//               // Enhanced Modal confirmation
//               try {
//                 const confirmModal = Modal.confirm({
//                   title: "Delete Category",
//                   content: "Are you sure you want to delete this category? This action cannot be undone.",
//                   okText: "Yes, delete",
//                   okType: "danger",
//                   cancelText: "No",
//                   centered: true,
//                   onOk() {
//                     console.log('Modal OK clicked');
//                     handleDelete(record.category_id)
//                       .then(() => {
//                         confirmModal.destroy(); // Explicitly close the modal
//                       })
//                       .catch(error => {
//                         console.error('Delete failed:', error);
//                       });
//                   },
//                   onCancel() {
//                     console.log('Modal canceled');
//                   }
//                 });
//               } catch (error) {
//                 console.error('Error opening modal:', error);
//               }
//             }}
//           />
//         </Space>
//       ),
//     },
//   ]

//   return (
//     <ConfigProvider>
//       <AdminLayout>
//         <div style={{ padding: "24px" }}>
//           <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
//             <Title level={2}>Category Management</Title>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setEditingCategory(null)
//                 form.resetFields()
//                 setIsModalVisible(true)
//               }}
//             >
//               Add Category
//             </Button>
//           </div>

//           <Table 
//             columns={columns} 
//             dataSource={categories} 
//             rowKey="category_id"
//             loading={loading}
//           />

//           <Modal
//             title={editingCategory ? "Edit Category" : "Add New Category"}
//             open={isModalVisible}
//             onCancel={() => {
//               setIsModalVisible(false)
//               form.resetFields()
//             }}
//             footer={null}
//           >
//             <Form
//               form={form}
//               layout="vertical"
//               onFinish={onFinish}
//             >
//               <Form.Item
//                 name="name"
//                 label="Category Name"
//                 rules={[{ required: true, message: "Please enter category name" }]}
//               >
//                 <Input placeholder="Enter category name" />
//               </Form.Item>

//               <Form.Item
//                 name="description"
//                 label="Description"
//                 rules={[{ required: true, message: "Please enter description" }]}
//               >
//                 <TextArea rows={4} placeholder="Enter category description" />
//               </Form.Item>

//               <Form.Item
//                 name="image"
//                 label="Category Image"
//                 valuePropName="fileList"
//                 getValueFromEvent={(e) => {
//                   if (Array.isArray(e)) {
//                     return e;
//                   }
//                   return e?.fileList?.slice(-1);
//                 }}
//               >
//                 <Upload
//                   accept="image/*"
//                   listType="picture-card"
//                   maxCount={1}
//                   beforeUpload={() => false}
//                 >
//                   <div>
//                     <PlusOutlined />
//                     <div style={{ marginTop: 8 }}>Upload</div>
//                   </div>
//                 </Upload>
//               </Form.Item>

//               <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
//                 <Space>
//                   <Button onClick={() => {
//                     setIsModalVisible(false)
//                     form.resetFields()
//                   }}>
//                     Cancel
//                   </Button>
//                   <Button type="primary" htmlType="submit">
//                     {editingCategory ? "Update" : "Create"}
//                   </Button>
//                 </Space>
//               </Form.Item>
//             </Form>
//           </Modal>
//         </div>
//       </AdminLayout>
//     </ConfigProvider>
//   )
// }

// export default Categories




import React, { useState, useEffect } from "react"
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Upload,
  Image,
  ConfigProvider
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons"
import AdminLayout from "../components/AdminLayout"
import categoryService from "../../services/category.service"
import imageService from '../../services/image.service';

const { Title } = Typography
const { TextArea } = Input

const Categories = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingCategory, setEditingCategory] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState(null)

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await categoryService.getAllCategories()
      setCategories(data)
    } catch (error) {
      message.error("Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (values.image && values.image[0]?.originFileObj) {
        formData.append("image", values.image[0].originFileObj);
      }

      await categoryService.createCategory(formData);
      message.success("Category created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
      message.error("Failed to create category");
    }
  };

  const handleUpdate = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name.trim());
      formData.append("description", values.description?.trim() || '');
      
      if (values.image && values.image[0]?.originFileObj) {
        formData.append("image", values.image[0].originFileObj);
      }

      await categoryService.updateCategory(
        editingCategory.category_id, 
        formData
      );
      
      message.success("Category updated successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      message.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const onFinish = (values) => {
    if (editingCategory) {
      handleUpdate(values);
    } else {
      handleCreate(values);
    }
  };

  const handleDelete = async (id) => {
    try {
      console.log('Attempting to delete category with ID:', id);
      setLoading(true);
      const response = await categoryService.deleteCategory(id);
      message.success(response.message || "Category deleted successfully");
      fetchCategories();
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Delete error:', error);
      message.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image_url",
      key: "image",
      render: (image_url) => (
        image_url ? (
          <Image 
            src={`http://localhost:5000${image_url}`}
            alt="Category" 
            width={50} 
            height={50}
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ 
            width: 50, 
            height: 50, 
            background: '#f5f5f5', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#999' 
          }}>
            No Image
          </div>
        )
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category Id",
      dataIndex: "category_id",
      key: "category_id",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Products Count",
      dataIndex: "products_count",
      key: "productsCount",
      sorter: (a, b) => (a.products_count || 0) - (b.products_count || 0),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCategory(record);
              form.setFieldsValue({
                name: record.name,
                description: record.description,
              });
              setIsModalVisible(true);
            }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              console.log('Delete button clicked for record:', record);
              setDeleteConfirmation(record);
            }}
          />
        </Space>
      ),
    },
  ]

  return (
    <ConfigProvider>
      <AdminLayout>
        <div style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between" }}>
            <Title level={2}>Category Management</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingCategory(null)
                form.resetFields()
                setIsModalVisible(true)
              }}
            >
              Add Category
            </Button>
          </div>

          <Table 
            columns={columns} 
            dataSource={categories} 
            rowKey="category_id"
            loading={loading}
          />

          {/* Create/Edit Category Modal */}
          <Modal
            title={editingCategory ? "Edit Category" : "Add New Category"}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false)
              form.resetFields()
            }}
            footer={null}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item
                name="name"
                label="Category Name"
                rules={[{ required: true, message: "Please enter category name" }]}
              >
                <Input placeholder="Enter category name" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter description" }]}
              >
                <TextArea rows={4} placeholder="Enter category description" />
              </Form.Item>

              <Form.Item
                name="image"
                label="Category Image"
                valuePropName="fileList"
                getValueFromEvent={(e) => {
                  if (Array.isArray(e)) {
                    return e;
                  }
                  return e?.fileList?.slice(-1);
                }}
              >
                <Upload
                  accept="image/*"
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
                <Space>
                  <Button onClick={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                  }}>
                    Cancel
                  </Button>
                  <Button type="primary" htmlType="submit">
                    {editingCategory ? "Update" : "Create"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>

          {/* Delete Confirmation Modal */}
          {deleteConfirmation && (
            <Modal
              title="Delete Category"
              open={!!deleteConfirmation}
              onOk={() => handleDelete(deleteConfirmation.category_id)}
              onCancel={() => setDeleteConfirmation(null)}
              okText="Yes, Delete"
              cancelText="No, Cancel"
              okButtonProps={{ danger: true }}
            >
              Are you sure you want to delete the category "{deleteConfirmation.name}"? 
              This action cannot be undone.
            </Modal>
          )}
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default Categories