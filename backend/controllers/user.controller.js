const bcrypt = require("bcryptjs")
const { users } = require("../data/users")

// Get all users
const getAllUsers = (req, res) => {
  try {
    // Filter out sensitive information
    const filteredUsers = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      status: user.status,
      createdAt: user.createdAt,
    }))

    res.status(200).json(filteredUsers)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get a single user by ID
const getUserById = (req, res) => {
  try {
    const { id } = req.params

    // Find user
    const user = users.find((user) => user.id === Number.parseInt(id))
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Filter out sensitive information
    const filteredUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      status: user.status,
      createdAt: user.createdAt,
    }

    res.status(200).json(filteredUser)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a new user
const createUser = (req, res) => {
  try {
    const { firstName, lastName, email, password, role, phone, address } = req.body

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Validate role
    const validRoles = ["admin", "franchiser", "distributor", "customer"]
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
      role,
      phone,
      address,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    // Add user to the array (in a real app, this would be a database insert)
    users.push(newUser)

    // Filter out sensitive information
    const filteredUser = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address,
      status: newUser.status,
      createdAt: newUser.createdAt,
    }

    res.status(201).json({
      message: "User created successfully",
      user: filteredUser,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update a user
const updateUser = (req, res) => {
  try {
    const { id } = req.params
    const { firstName, lastName, email, password, role, phone, address, status } = req.body

    // Find user
    const userIndex = users.findIndex((user) => user.id === Number.parseInt(id))
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if email is already taken by another user
    if (email && email !== users[userIndex].email) {
      const emailExists = users.some((user) => user.email === email && user.id !== Number.parseInt(id))
      if (emailExists) {
        return res.status(400).json({ message: "Email is already taken" })
      }
    }

    // Validate role if provided
    if (role) {
      const validRoles = ["admin", "franchiser", "distributor", "customer"]
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" })
      }
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ["active", "inactive"]
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" })
      }
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      email: email || users[userIndex].email,
      password: password ? bcrypt.hashSync(password, 10) : users[userIndex].password,
      role: role || users[userIndex].role,
      phone: phone || users[userIndex].phone,
      address: address || users[userIndex].address,
      status: status || users[userIndex].status,
    }

    // Filter out sensitive information
    const filteredUser = {
      id: users[userIndex].id,
      firstName: users[userIndex].firstName,
      lastName: users[userIndex].lastName,
      email: users[userIndex].email,
      role: users[userIndex].role,
      phone: users[userIndex].phone,
      address: users[userIndex].address,
      status: users[userIndex].status,
      createdAt: users[userIndex].createdAt,
    }

    res.status(200).json({
      message: "User updated successfully",
      user: filteredUser,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete a user
const deleteUser = (req, res) => {
  try {
    const { id } = req.params

    // Find user
    const userIndex = users.findIndex((user) => user.id === Number.parseInt(id))
    if (userIndex === -1) {
      return res.status(404).json({ message: "User not found" })
    }

    // Remove user from the array
    users.splice(userIndex, 1)

    res.status(200).json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

