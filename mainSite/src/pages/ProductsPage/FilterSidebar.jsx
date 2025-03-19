"use client"
import "./FilterSidebar.css"

function FilterSidebar({ onClose, onCategoryChange, selectedCategory, onClearFilters }) {
  const categories = [
    { id: "all", name: "All Products" },
    { id: "perfume-spray", name: "Perfume Spray" },
    { id: "attar", name: "Attar" },
    { id: "body-spray", name: "Body Spray" },
    { id: "gift-set", name: "Gift Sets" },
    { id: "discovery-set", name: "Discovery Sets" },
  ]

  return (
    <div className="filter-sidebar-overlay">
      <div className="filter-sidebar">
        <div className="filter-header">
          <h3>Filters</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="filter-content">
          <div className="filter-section">
            <h4>Category</h4>
            <div className="category-options">
              {categories.map((category) => (
                <div key={category.id} className="category-option">
                  <input
                    type="radio"
                    id={category.id}
                    name="category"
                    checked={selectedCategory === category.id}
                    onChange={() => onCategoryChange(category.id)}
                  />
                  <label htmlFor={category.id}>{category.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-range">
              <div className="price-inputs">
                <div>
                  <label htmlFor="min-price">Min Price</label>
                  <input type="number" id="min-price" placeholder="0" />
                </div>
                <div>
                  <label htmlFor="max-price">Max Price</label>
                  <input type="number" id="max-price" placeholder="2000" />
                </div>
              </div>
            </div>
          </div>

          <div className="filter-section">
            <h4>Size</h4>
            <div className="size-options">
              <div className="size-option">
                <input type="checkbox" id="size-20ml" />
                <label htmlFor="size-20ml">20 ML</label>
              </div>
              <div className="size-option">
                <input type="checkbox" id="size-50ml" />
                <label htmlFor="size-50ml">50 ML</label>
              </div>
              <div className="size-option">
                <input type="checkbox" id="size-100ml" />
                <label htmlFor="size-100ml">100 ML</label>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-actions">
          <button className="clear-filters-button" onClick={onClearFilters}>
            Clear All
          </button>
          <button className="apply-filters-button" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar

