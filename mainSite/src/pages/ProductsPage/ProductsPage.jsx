"use client"
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"
import FilterSidebar from "./FilterSidebar"
import "../../styles/ProductsPage.css"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { use } from "react";
import Loader from "../../components/Loader";
import axios from "axios"
const Src = import.meta.env.VITE_Src;
function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { categoryName } = useParams();
  const placeholderImage = "https://picsum.photos/300/300";
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${Src}/api/categories/`);
        setCategories(response.data);
        const category = response.data.find(cat => cat.category_id === categoryName);
        setSelectedCategory(category);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${Src}/api/products`);
        const allProducts = response.data;
  
        // filter by category from URL params
        const filtered = allProducts.filter((product) =>
          product.category_id.toLowerCase() === categoryName.toLowerCase()
        );
  
        // Map to frontend-friendly structure
        const mappedProducts = filtered.map((product) => ({
          id: product.product_id,
          name: product.name,
          price: product.price,
          originalPrice: Math.round(product.price * 1.5),
          discount: `${Math.round((1 - product.price / (product.price * 1.5)) * 100)}% off`,
          image: `${Src}${product.images[0]}` || placeholderImage,
          rating: parseFloat(product.rating || (Math.random() * 1.5 + 4).toFixed(1)),
          reviews: Math.floor(Math.random() * 200) + 50,
          category: product.category_id.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"),
          isNew: Math.random() > 0.5
        }));
  
        setFeaturedProducts(filtered); // if needed
        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      } catch (error) {
        console.error("Error fetching and processing products:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Fetch products (simulated)
  // useEffect(() => {
  //   const filteredProducts = featuredProducts.filter(
  //     (product) =>
  //       product.category_id.toLowerCase() === categoryName.toLowerCase()
  //   );
  //   // In a real app, you would fetch from an API
  //   const fetchProducts = async () => {
  //     setLoading(true)
  //     try {
  //       const data = filteredProducts.map((product, index) => ({
  //         id: product.product_id,
  //         name: product.name,
  //         price: product.price,
  //         originalPrice: Math.round(product.price * 1.5), // Assuming a 50% markup for original price
  //         discount: `${Math.round((1 - product.price / (product.price * 1.5)) * 100)}% off`,
  //         image: product.image,
  //         rating: (Math.random() * 1.5 + 4).toFixed(1), // Generating random ratings between 4.0 and 5.5
  //         reviews: Math.floor(Math.random() * 200) + 50, // Generating random reviews between 50 and 250
  //         category: product.category_id.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"),
  //         isNew: Math.random() > 0.5, // Randomly marking some products as new
  //       }));
  //       setProducts(data)
  //       setFilteredProducts(data)
  //     } catch (error) {
  //       console.error("Error fetching products:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   fetchProducts()
  // }, [])

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
      {loading && <Loader />}
      <Header />
      {/* Page Header */}
      <div className="page-header">
      <h1>{selectedCategory?.name || "All Products"}</h1>
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
            // selectedCategory={categoryFilter}
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

