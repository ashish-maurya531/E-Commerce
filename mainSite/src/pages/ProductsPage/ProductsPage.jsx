"use client"
import { useParams } from "react-router-dom";
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
  const { categoryName } = useParams();
  const placeholderImage = "https://picsum.photos/300/300";
  const featuredProducts = [
    {
      id: 1,
      name: "Super Health",
      price: 499,
      image: placeholderImage,
      category: "General Health & Wellness",
    },
    {
      id: 2,
      name: "Liver Care",
      price: 599,
      image: placeholderImage,
      category: "Liver & Kidney Health",
    },
    {
      id: 3,
      name: "Total Health",
      price: 699,
      image: placeholderImage,
      category: "General Health & Wellness",
    },
    {
      id: 4,
      name: "Acai Berry",
      price: 799,
      image: placeholderImage,
      category: "Immunity & Respiratory Health",
    },
    {
      id: 5,
      name: "Cough Syrup",
      price: 299,
      image: placeholderImage,
      category: "Immunity & Respiratory Health",
    },
    {
      id: 6,
      name: "Piles Care",
      price: 549,
      image: placeholderImage,
      category: "Digestive & Gut Health",
    },
    {
      id: 7,
      name: "Ortho Care",
      price: 699,
      image: placeholderImage,
      category: "Joint & Bone Health",
    },
    {
      id: 8,
      name: "Bhringraj Hair Oil",
      price: 399,
      image: placeholderImage,
      category: "Skin & Hair Care",
    },
    {
      id: 9,
      name: "Aloe Vera Shampoo",
      price: 499,
      image: placeholderImage,
      category: "Skin & Hair Care",
    },
    {
      id: 10,
      name: "Aloe Vera Face Wash",
      price: 349,
      image: placeholderImage,
      category: "Skin & Hair Care",
    },
    {
      id: 11,
      name: "Kidney Care",
      price: 599,
      image: placeholderImage,
      category: "Liver & Kidney Health",
    },
    {
      id: 12,
      name: "Lady Care",
      price: 649,
      image: placeholderImage,
      category: "Women's Health",
    },
    {
      id: 13,
      name: "Blood Purifier",
      price: 499,
      image: placeholderImage,
      category: "Skin & Hair Care",
    },
    {
      id: 14,
      name: "Cyst Care",
      price: 749,
      image: placeholderImage,
      category: "Women's Health",
    },
    {
      id: 15,
      name: "Digestive Care Tablets",
      price: 399,
      image: placeholderImage,
      category: "Digestive & Gut Health",
    },
    {
      id: 16,
      name: "Charam Rog Nashak Malham",
      price: 599,
      image: placeholderImage,
      category: "Skin & Hair Care",
    },
    {
      id: 17,
      name: "Stamina",
      price: 799,
      image: placeholderImage,
      category: "Men's Health",
    },
    {
      id: 18,
      name: "Eye Drop",
      price: 299,
      image: placeholderImage,
      category: "Eye & Vision Care",
    },
    {
      id: 19,
      name: "Sugar Control",
      price: 649,
      image: placeholderImage,
      category: "General Health & Wellness",
    },
    {
      id: 20,
      name: "Man Care",
      price: 749,
      image: placeholderImage,
      category: "Men's Health",
    },
    {
      id: 21,
      name: "Young Tarang",
      price: 849,
      image: placeholderImage,
      category: "Men's Health",
    },
    {
      id: 22,
      name: "Digestive Care Powder",
      price: 449,
      image: placeholderImage,
      category: "Digestive & Gut Health",
    }
];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // Fetch products (simulated)
  useEffect(() => {
    const filteredProducts = featuredProducts.filter(
      (product) =>
        product.category.toLowerCase() === categoryName.toLowerCase()
    );
    // In a real app, you would fetch from an API
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const data = filteredProducts.map((product, index) => ({
          id: index + 1,
          name: product.name,
          price: product.price,
          originalPrice: Math.round(product.price * 1.5), // Assuming a 50% markup for original price
          discount: `${Math.round((1 - product.price / (product.price * 1.5)) * 100)}% off`,
          image: product.image,
          rating: (Math.random() * 1.5 + 4).toFixed(1), // Generating random ratings between 4.0 and 5.5
          reviews: Math.floor(Math.random() * 200) + 50, // Generating random reviews between 50 and 250
          category: product.category.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-"),
          isNew: Math.random() > 0.5, // Randomly marking some products as new
        }));
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
        <h1>{categoryName ? categoryName.replace("-", " ") : "All Products"}</h1>
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

