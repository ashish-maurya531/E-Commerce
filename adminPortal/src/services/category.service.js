import api from './api'

const categoryService = {
  getAllCategories: async () => {
    const response = await api.get('/categories')
    return response.data
  },

  getCategoryById: async (categoryId) => {
    const response = await api.get(`/categories/${categoryId}`)
    return response.data
  },

  createCategory: async (formData) => {
    console.log('Sending category data:', Object.fromEntries(formData.entries()));
    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  updateCategory: async (categoryId, formData) => {
    const response = await api.put(`/categories/${categoryId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteCategory: async (categoryId) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
}

export default categoryService

