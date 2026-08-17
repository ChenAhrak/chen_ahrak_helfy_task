const BASE_URL = 'http://localhost:4000/api';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (networkError) {
    throw new Error('Cannot reach the server. Is the backend running on port 4000?');
  }

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (body && body.error) message = body.error;
    } catch {
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const getTasks = () => request('/tasks');

export const createTask = (task) =>
  request('/tasks', { method: 'POST', body: JSON.stringify(task) });

export const updateTask = (id, updates) =>
  request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(updates) });

export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: 'DELETE' });

export const toggleTask = (id) =>
  request(`/tasks/${id}/toggle`, { method: 'PATCH' });
