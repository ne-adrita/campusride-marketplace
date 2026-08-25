import { loadJSON, saveJSON, seedCurrentUser, IS_PREVIEW } from '../data';
const delay = () => new Promise(r => setTimeout(r, 30));

export async function registerToMongoDB({ firebaseUid, name, email, studentId }) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const user = { ...seedCurrentUser, name, email, studentId, user_id: firebaseUid };
      saveJSON('currentUser', user);
      return { success: true, data: { user }, error: null };
    }

    const { default: api } = await import('../api/axios');
    
    const response = await api.post('/auth/register', { 
      firebaseUid, 
      name, 
      email, 
      studentId 
    });
    
    const { user } = response.data;
    saveJSON('currentUser', user);
    
    return { success: true, data: { user }, error: null };
  } catch (error) {
    console.error('registerToMongoDB error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to save to database';
    return { success: false, error: msg, data: null };
  }
}

export async function getMe(firebaseUid, firebaseToken) {
  try {
    if (IS_PREVIEW) {
      await delay();
      const user = loadJSON('currentUser', { ...seedCurrentUser, user_id: firebaseUid });
      return { data: user, error: null };
    }

    const { default: api } = await import('../api/axios');
    
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
        'x-firebase-uid': firebaseUid
      }
    });
    
    return { data: response.data, error: null };
  } catch (error) {
    console.error('getMe error:', error);
    const msg = error?.response?.data?.message || error?.message || 'Failed to fetch user';
    return { data: null, error: msg };
  }
}