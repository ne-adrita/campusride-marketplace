import { loadJSON, saveJSON, seedCurrentUser, IS_PREVIEW } from '../data';
const delay = () => new Promise(r => setTimeout(r, 30));

// Firebase already created the actual account by the time this is called;
// this just creates the matching CampusRide profile in MongoDB. The
// axios interceptor attaches the caller's Firebase ID token automatically,
// so the backend derives whose account this is from the token itself.
export async function registerToMongoDB({ name, email, studentId }) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const user = { ...seedCurrentUser, name, email, studentId };
      saveJSON('currentUser', user);
      return { success: true, data: { user }, error: null };
    }

    const { default: api } = await import('../api/axios');
    const response = await api.post('/auth/register', { name, studentId });
    const { user } = response.data;
    saveJSON('currentUser', user);

    return { success: true, data: { user }, error: null };
  } catch (error) {
    console.error('registerToMongoDB error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to save to database';
    return { success: false, error: msg, data: null };
  }
}

export async function getMe() {
  try {
    if (IS_PREVIEW) {
      await delay();
      const user = loadJSON('currentUser', seedCurrentUser);
      return { data: user, error: null };
    }

    const { default: api } = await import('../api/axios');
    const response = await api.get('/auth/me');
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getMe error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch user';
    return { data: null, error: msg };
  }
}
