const AUTH_TOKEN_KEY = 'forever_auth_token';

export function getAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function setAuthToken(token) {
  try {
    if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    /* ignore */
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    /* ignore */
  }
}

function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginUser(username, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Invalid credentials');
  }
  setAuthToken(data.token);
  return data.user;
}

export async function registerUser({ username, password, senderName, recipientName }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, senderName, recipientName }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to create account');
  }
  setAuthToken(data.token);
  return data.user;
}

export async function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  try {
    const res = await fetch('/api/auth/me', {
      headers: authHeaders(),
    });
    if (!res.ok) {
      clearAuthToken();
      return null;
    }
    const data = await res.json();
    return data.user;
  } catch (e) {
    return null;
  }
}

export async function updateProfile({ senderName, recipientName }) {
  const res = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ senderName, recipientName }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to update profile');
  }
  return data.user;
}

export async function fetchPhotos(username) {
  const url = username ? `/api/photos?u=${encodeURIComponent(username)}` : '/api/photos';
  const res = await fetch(url, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch photos');
  }
  return data.photos;
}

export async function fetchUserSite(username) {
  const res = await fetch(`/api/photos/site/${encodeURIComponent(username)}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to load user site');
  }
  return data;
}

export async function uploadPhotoApi({ file, imageUrl, caption, date }) {
  const formData = new FormData();
  if (file) {
    formData.append('image', file);
  } else if (imageUrl) {
    formData.append('imageUrl', imageUrl);
  }
  if (caption) formData.append('caption', caption);
  if (date) formData.append('date', date);

  const res = await fetch('/api/photos/upload', {
    method: 'POST',
    headers: {
      ...authHeaders(),
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to upload photo to Cloudinary/MongoDB');
  }
  return data.photo;
}

export async function deletePhotoApi(id) {
  const res = await fetch(`/api/photos/${id}`, {
    method: 'DELETE',
    headers: {
      ...authHeaders(),
    },
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete photo');
  }
  return data;
}
