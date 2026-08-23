import { loadJSON, saveJSON, seedCurrentUser, seedUsers, seedProducts, seedRides, IS_PREVIEW } from '../data';

const delay = () => new Promise(r => setTimeout(r, 30));

export async function getUserById(id) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const users = loadJSON('users', seedUsers);
      const currentUser = loadJSON('currentUser', seedCurrentUser);
      const u = id === currentUser.user_id ? currentUser : users[id];
      if (!u) throw new Error('User not found');
      return { data: u, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/users/' + id);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getUserById error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch user';
    return { data: null, error: msg };
  }
}

export async function getUserListings(id) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const products = loadJSON('products', seedProducts);
      return { data: products.filter(p => p.seller_id === id), error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/users/' + id + '/listings');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getUserListings error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch listings';
    return { data: [], error: msg };
  }
}

export async function getDashboardStats() {
  try {
    if (IS_PREVIEW) {
      await delay();
      const currentUser = loadJSON('currentUser', seedCurrentUser);
      const products = loadJSON('products', seedProducts);
      const rides = loadJSON('rides', seedRides);
      return {
        data: {
          activeListings: products.filter(p => p.seller_id === currentUser.user_id).length,
          ridesOffered: rides.filter(r => r.driver_id === currentUser.user_id).length,
          unreadMessages: Math.floor(Math.random() * 5),
          rating: currentUser.rating_avg || 0,
        },
        error: null,
      };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/users/stats');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getDashboardStats error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch stats';
    return { data: { activeListings: 0, ridesOffered: 0, unreadMessages: 0, rating: 0 }, error: msg };
  }
}

export async function updateProfile(data) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const currentUser = loadJSON('currentUser', seedCurrentUser);
      Object.assign(currentUser, data);
      saveJSON('currentUser', currentUser);
      return { data: currentUser, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.put('/users/profile', data);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('updateProfile error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to update profile';
    return { data: null, error: msg };
  }
}

export async function getPendingUsers() {
  try {
    if (IS_PREVIEW) {
      await delay();
      const users = loadJSON('users', seedUsers);
      return { data: Object.values(users).filter(u => !u.verified), error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.get('/admin/users/pending');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getPendingUsers error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch pending users';
    return { data: [], error: msg };
  }
}

export async function verifyUser(userId) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const users = loadJSON('users', seedUsers);
      const u = users[userId];
      if (!u) throw new Error('User not found');
      u.verified = true;
      saveJSON('users', users);
      return { data: { message: 'User verified successfully' }, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.put('/admin/users/' + userId + '/verify');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('verifyUser error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to verify user';
    return { data: null, error: msg };
  }
}
