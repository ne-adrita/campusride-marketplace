import { loadJSON, saveJSON, saveToken, seedCurrentUser, IS_PREVIEW } from '../data';

const delay = () => new Promise(r => setTimeout(r, 30));

export async function login(email, password) {
  try {
    if (IS_PREVIEW) {
      await delay();
      if (!email || !password) return { success: false, error: 'Email and password are required', data: null };
      const user = { ...seedCurrentUser, email };
      const token = 'preview-token-' + Date.now();
      saveToken(token);
      saveJSON('currentUser', user);
      return { success: true, data: { token, user }, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    saveToken(token);
    saveJSON('currentUser', user);
    return { success: true, data: { token, user }, error: null };
  } catch (error) {
    console.error('login error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Login failed';
    return { success: false, error: msg, data: null };
  }
}

export async function register(name, email, studentId, password) {
  try {
    if (IS_PREVIEW) {
      await delay();
      if (!name || !email || !studentId || !password) return { success: false, error: 'All fields are required', data: null };
      const user = { ...seedCurrentUser, name, email, studentId, user_id: 'user_' + Date.now() };
      const token = 'preview-token-' + Date.now();
      saveToken(token);
      saveJSON('currentUser', user);
      return { success: true, data: { token, user }, error: null };
    }
    const { default: api } = await import('../api/axios');
    const response = await api.post('/auth/register', { name, email, studentId, password });
    const { token, user } = response.data;
    saveToken(token);
    saveJSON('currentUser', user);
    return { success: true, data: { token, user }, error: null };
  } catch (error) {
    console.error('register error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Registration failed';
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
