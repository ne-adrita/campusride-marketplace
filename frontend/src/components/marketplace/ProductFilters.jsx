import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';
import useDebounce from '../../hooks/useDebounce';

const ProductFilters = ({ filters, categories = [], onFilterChange, onClearFilters }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  useEffect(() => {
    if (debouncedSearch !== (filters.search || '')) {
      onFilterChange({ search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'search') {
      setSearchInput(value);
    } else {
      onFilterChange({ [name]: value });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="search"
            value={searchInput}
            onChange={handleChange}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>

        <select
          name="category"
          value={filters.category || ''}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
          ))}
        </select>

        <select
          name="condition"
          value={filters.condition || ''}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
        </select>

        <div className="flex space-x-2">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice || ''}
            onChange={handleChange}
            placeholder="Min $"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice || ''}
            onChange={handleChange}
            placeholder="Max $"
            className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          />
        </div>

        <select
          name="sort"
          value={filters.sort || 'newest'}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
        </select>

        <button onClick={onClearFilters} className="btn-secondary text-sm whitespace-nowrap focus-visible:ring-2 focus-visible:ring-primary-500 w-full sm:w-auto">
          Clear Filters
        </button>
      </div>
    </div>
  );
};

ProductFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    category: PropTypes.string,
    condition: PropTypes.string,
    minPrice: PropTypes.string,
    maxPrice: PropTypes.string,
    sort: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
  categories: PropTypes.arrayOf(PropTypes.shape({
    category_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })),
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default ProductFilters;
