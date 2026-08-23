import { loadJSON, saveJSON, seedProducts, seedCategories, generateId, IS_PREVIEW } from '../data';

const delay = () => new Promise(r => setTimeout(r, 30));

export async function getCategories() {
  try {
    if (IS_PREVIEW) {
      await delay();
      const cats = loadJSON('categories', seedCategories);
      return { data: cats, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/categories');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getCategories error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch categories';
    return { data: [], error: msg };
  }
}

export async function getProducts(params = {}) {
  try {
    if (IS_PREVIEW) {
      await delay();
      let products = loadJSON('products', seedProducts);
      const cats = loadJSON('categories', seedCategories);

      if (params.search) {
        const s = params.search.toLowerCase();
        products = products.filter(p => p.title.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
      }
      if (params.category) products = products.filter(p => p.category_id === params.category);
      if (params.condition) products = products.filter(p => p.condition === params.condition);
      if (params.minPrice) products = products.filter(p => p.price >= Number(params.minPrice));
      if (params.maxPrice) products = products.filter(p => p.price <= Number(params.maxPrice));
      if (params.location) products = products.filter(p => (p.location || '').toLowerCase().includes(params.location.toLowerCase()));

      if (params.sort === 'price_asc' || params.sort === 'price_low') products.sort((a, b) => a.price - b.price);
      else if (params.sort === 'price_desc' || params.sort === 'price_high') products.sort((a, b) => b.price - a.price);
      else products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const page = Number(params.page) || 1;
      const limit = Number(params.limit) || 20;
      const total = products.length;
      const pages = Math.ceil(total / limit);
      const paginated = products.slice((page - 1) * limit, page * limit);

      return { data: { products: paginated, pagination: { page, limit, total, pages }, categories: cats }, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/products', { params });
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getProducts error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch products';
    return { data: { products: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 }, categories: [] }, error: msg };
  }
}

export async function getProductById(id) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const products = loadJSON('products', seedProducts);
      const product = products.find(p => p.product_id === id);
      if (!product) throw new Error('Product not found');
      return { data: product, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/products/' + id);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getProductById error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch product';
    return { data: null, error: msg };
  }
}

export async function createProduct(data) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const products = loadJSON('products', seedProducts);
      const currentUser = loadJSON('currentUser', {});
      const newProduct = {
        product_id: generateId('prod_'),
        ...data,
        price: Number(data.price),
        seller_id: currentUser.user_id,
        seller_name: currentUser.name,
        seller_rating: currentUser.rating_avg || 0,
        seller_verified: currentUser.verified || false,
        image: null,
        created_at: new Date().toISOString(),
      };
      products.unshift(newProduct);
      saveJSON('products', products);
      return { data: newProduct, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.post('/products', data);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('createProduct error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to create product';
    return { data: null, error: msg };
  }
}

export async function updateProduct(id, data) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const products = loadJSON('products', seedProducts);
      const idx = products.findIndex(p => p.product_id === id);
      if (idx === -1) throw new Error('Product not found');
      products[idx] = { ...products[idx], ...data };
      saveJSON('products', products);
      return { data: products[idx], error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.put('/products/' + id, data);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('updateProduct error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to update product';
    return { data: null, error: msg };
  }
}

export async function deleteProduct(id) {
  try {
    if (IS_PREVIEW) {
      await delay();
      let products = loadJSON('products', seedProducts);
      products = products.filter(p => p.product_id !== id);
      saveJSON('products', products);
      return { data: { message: 'Product deleted' }, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.delete('/products/' + id);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('deleteProduct error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to delete product';
    return { data: null, error: msg };
  }
}
