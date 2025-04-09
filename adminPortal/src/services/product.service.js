import api from "./api"

const getAllProducts = async () => {
  const response = await api.get("/products")
  return response.data
}

const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

const updateProduct = async (productId, formData) => {
  const response = await api.put(`/products/${productId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error.message
  }
}

const productService = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct
};

export default productService;