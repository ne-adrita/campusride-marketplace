import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../services/productService';
import ProductCard from '../components/marketplace/ProductCard';
import ProductFilters from '../components/marketplace/ProductFilters';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FaSearch } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { logPerformance } from '../utils/performance';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', minPrice: '', maxPrice: '', condition: '', location: '', sort: 'newest' });
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [categories, setCategories] = useState([]);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  const fetchCategories = async () => {
    const start = performance.now();
    const { data, error: catError } = await getCategories();
    logPerformance('fetchCategories', performance.now() - start);
    if (catError) {
      console.error('Error fetching categories:', catError);
      toast.error(catError);
      return;
    }
    if (data) setCategories(data);
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const { data, error: fetchError } = await getProducts({ ...filters, page: pagination.page, limit: pagination.limit });
      logPerformance('fetchProducts', performance.now() - start);
      if (fetchError) {
        setError(fetchError);
        toast.error(fetchError);
        setProducts([]);
        return;
      }
      if (data) {
        setProducts(data.products || []);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally { setLoading(false); }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', condition: '', location: '', sort: 'newest' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-navy-50 py-8">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-navy-800">Marketplace</h1>
          <Link to="/create-listing" className="btn-primary w-full sm:w-auto text-center">+ List Your Item</Link>
        </div>

        <ProductFilters filters={filters} categories={categories} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />

        <div className="mt-6">
          <p className="text-navy-400 mb-4">{pagination.total} items found</p>
          {loading ? <LoadingSpinner /> : error ? (
            <div className="text-center py-12 surface-card">
              <p className="text-red-600 mb-2">{error}</p>
              <button onClick={fetchProducts} className="btn-primary mt-2">Retry</button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 surface-card">
              <FaSearch className="text-navy-200 text-5xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-navy-600">No products found</h3>
              <p className="text-sm text-navy-400 mt-1">Try adjusting your search or filters</p>
              <button onClick={handleClearFilters} className="btn-primary mt-4">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => <ProductCard key={product.product_id} product={product} />)}
              </div>
              <Pagination currentPage={pagination.page} totalPages={pagination.pages} onPageChange={(page) => { setPagination(prev => ({ ...prev, page })); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
