import { loadJSON, saveJSON, seedProducts, seedWishlist, IS_PREVIEW } from '../data';

const delay = () => new Promise(r => setTimeout(r, 30));

export async function getWishlist() {
  try {
    if (IS_PREVIEW) {
      await delay();
      const products = loadJSON('products', seedProducts);
      const wishlist = loadJSON('wishlist', seedWishlist);
      return { data: products.filter(p => wishlist.includes(p.product_id)), error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/wishlist');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getWishlist error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch wishlist';
    return { data: [], error: msg };
  }
}

export async function addToWishlist(productId) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const wishlist = loadJSON('wishlist', seedWishlist);
      if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveJSON('wishlist', wishlist);
      }
      return { data: { message: 'Added to wishlist' }, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.post('/products/' + productId + '/wishlist');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('addToWishlist error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to add to wishlist';
    return { data: null, error: msg };
  }
}

export async function removeFromWishlist(productId) {
  try {
    if (IS_PREVIEW) {
      await delay();
      let wishlist = loadJSON('wishlist', seedWishlist);
      wishlist = wishlist.filter(id => id !== productId);
      saveJSON('wishlist', wishlist);
      return { data: { message: 'Removed from wishlist' }, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.delete('/products/' + productId + '/wishlist');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('removeFromWishlist error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to remove from wishlist';
    return { data: null, error: msg };
  }
}
