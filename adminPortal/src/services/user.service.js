import api from './api'

const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  createUser: async (userData) => {
    const response = await api.post('/users', {
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password,
      phoneno: userData.phoneno,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      pincode: userData.pincode,
      role: userData.role
    })
    return response.data
  },
    
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, {
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password, // Optional
      phoneno: userData.phoneno,
      address: userData.address,
      city: userData.city,
      state: userData.state,
      pincode: userData.pincode,
      role: userData.role,
      status: userData.status
    })
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  }
}

export default userService

