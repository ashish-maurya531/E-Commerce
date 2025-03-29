import api from './api'

const productService = {
  getAllProducts: async (params) => {
    const response = await api.get('/products', { params })
    return response.data
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  createProduct: async (productData) => {
    // Convert image file list to array of files
    let images = []
    if (productData.image) {
      images = productData.image.map(file => file.originFileObj)
    }

    // Format variants to ensure no null values
    const formattedVariants = productData.variants.map(variant => ({
      pack_size: parseInt(variant.pack_size) || 1,
      stock: parseInt(variant.stock) || 0,
      min_stock: parseInt(variant.min_stock) || 10,
      volume: variant.volume || '',
      price: parseFloat(variant.price) || 0,
      original_price: parseFloat(variant.original_price) || 0
    }))

    // Prepare the request body with validated data
    const requestBody = {
      name: productData.name.trim(),
      sku: productData.sku.trim(),
      category_id: productData.category_id,
      status: productData.status || 'Active',
      description: productData.description?.trim() || '',
      variants: formattedVariants,
      images: images
    }

    console.log('Request Body:', requestBody) // For debugging
    const response = await api.post('/products', requestBody)
    return response.data
  },

  updateProduct: async (id, productData) => {
    // Convert image file list to array of files
    let images = []
    if (productData.image) {
      images = productData.image.map(file => file.originFileObj)
    }

    // Prepare the request body
    const requestBody = {
      name: productData.name,
      sku: productData.sku,
      category_id: productData.category_id,
      status: productData.status,
      description: productData.description,
      variants: productData.variants,
      images: images
    }

    const response = await api.put(`/products/${id}`, requestBody)
    return response.data
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  }
}

export default productService