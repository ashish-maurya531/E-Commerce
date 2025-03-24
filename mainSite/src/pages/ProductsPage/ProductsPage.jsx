"use client"

import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import FilterSidebar from "./FilterSidebar"
import "../../styles/ProductsPage.css"
import Header from "../../components/Header"
import Footer from "../../components/Footer"

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Fetch products (simulated)
  useEffect(() => {
    // In a real app, you would fetch from an API
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Simulated data - replace with actual API call
        const data = [
          {
            id: 1,
            name: "Perfume Discovery Set - Pack of 10 (5ml Each)",
            price: 999,
            originalPrice: 1999,
            discount: "50% off",
            image: "https://via.placeholder.com/300",
            rating: 4.7,
            reviews: 129,
            category: "discovery-set",
            isNew: true,
          },
          {
            id: 2,
            name: "Legendary Gift Set 3 Pcs Set of Premium Perfume Spray",
            price: 999,
            originalPrice: 1499,
            discount: "33% off",
            image: "https://via.placeholder.com/300",
            rating: 4.8,
            reviews: 142,
            category: "gift-set",
          },
          {
            id: 3,
            name: "The Story 20 ML",
            price: 399,
            originalPrice: 599,
            discount: "33% off",
            image: "https://via.placeholder.com/300",
            rating: 4.8,
            reviews: 119,
            category: "perfume-spray",
          },
          {
            id: 4,
            name: "The Story 50 ML",
            price: 799,
            originalPrice: 1199,
            discount: "33% off",
            image: "https://via.placeholder.com/300",
            rating: 4.8,
            reviews: 119,
            category: "perfume-spray",
          },
          {
            id: 5,
            name: "AQ 365 Perfume Spray 20 ML",
            price: 399,
            originalPrice: 599,
            discount: "33% off",
            image: "https://via.placeholder.com/300",
            rating: 4.7,
            reviews: 1026,
            category: "perfume-spray",
          },
          {
            id: 6,
            name: "AQ 365 Perfume Spray 50 ML",
            price: 799,
            originalPrice: 1199,
            discount: "33% off",
            image: "https://via.placeholder.com/300",
            rating: 4.7,
            reviews: 1026,
            category: "perfume-spray",
          },
          {
            id: 7,
            name: "Royal Attar Perfume 20 ML",
            price: 499,
            originalPrice: 699,
            discount: "29% off",
            image: "https://via.placeholder.com/300",
            rating: 4.9,
            reviews: 215,
            category: "attar",
          },
          {
            id: 8,
            name: "Premium Body Spray 150 ML",
            price: 599,
            originalPrice: 899,
            discount: "33% off",
            image: "https://via.placeholder.com/300",
            rating: 4.6,
            reviews: 87,
            category: "body-spray",
          },
        ]
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  useEffect(() => {
    let result = [...products]

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((product) => product.name.toLowerCase().includes(query))
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default: // featured
        // Keep default order
        break
    }

    setFilteredProducts(result)
  }, [products, searchQuery, sortBy, categoryFilter])

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleCategoryChange = (category) => {
    setCategoryFilter(category)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSortBy("featured")
    setCategoryFilter("all")
  }

  return (
    <div className="products-page">
      <Header />
      {/* Page Header */}
      <div className="page-header">
        <h1>Premium Perfume Spray (EDP)</h1>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Search and Filter Controls */}
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search perfumes..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-controls">
            <button className="filter-button" onClick={toggleFilters}>
              Filters
            </button>

            <div className="sort-container">
              <select value={sortBy} onChange={handleSortChange} className="sort-select">
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Sidebar */}
        {showFilters && (
          <FilterSidebar
            onClose={toggleFilters}
            onCategoryChange={handleCategoryChange}
            selectedCategory={categoryFilter}
            onClearFilters={clearFilters}
          />
        )}

        {/* Results Count */}
        <div className="results-count">
          <p>
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="product-skeleton"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button className="clear-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  )
}

export default ProductsPage

