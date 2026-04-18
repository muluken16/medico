const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = IS_LOCAL ? 'http://localhost:8000/api' : 'https://fullday.medicodigitals.com/api';

export const GET_MEDIA_URL = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const host = IS_LOCAL ? 'http://localhost:8000' : 'https://fullday.medicodigitals.com';
  return `${host}${path}`;
};

async function apiAction(endpoint, method = 'GET', data = null, isFormData = false) {
  if (endpoint && !endpoint.endsWith('/')) endpoint += '/';
  const token = localStorage.getItem('adminToken');
  const options = {
    method,
    headers: {},
    cache: 'no-store',
  };

  if (token) {
    options.headers['Authorization'] = `Token ${token}`;
  }

  if (data) {
    if (isFormData) {
      options.body = data;
    } else {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(data);
    }
  }

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    if (method === 'DELETE' && res.status === 204) return null;
    throw new Error(`Server error. Expected JSON, got ${contentType}`);
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const error = new Error(errorData.error || errorData.detail || `HTTP Error ${res.status}`);
    error.data = errorData;
    throw error;
  }
  if (method === 'DELETE') return null;
  return res.json();
}

export const login = async (username, password) => {
  const data = await apiAction('/login/', 'POST', { username, password });
  if (data.token) {
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminUser', data.username);
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const api = {
  services: {
    list: () => apiAction('/services/'),
    create: (data) => apiAction('/services/', 'POST', data),
    update: (id, data) => apiAction(`/services/${id}/`, 'PUT', data),
    delete: (id) => apiAction(`/services/${id}/`, 'DELETE'),
  },
  posts: {
    list: () => apiAction('/posts/'),
    create: (data) => apiAction('/posts/', 'POST', data, true),
    update: (id, data) => apiAction(`/posts/${id}/`, 'PATCH', data, true),
    delete: (id) => apiAction(`/posts/${id}/`, 'DELETE'),
  },
  reviews: {
    list: () => apiAction('/reviews/'),
    create: (data) => apiAction('/reviews/', 'POST', data, true),
    delete: (id) => apiAction(`/reviews/${id}/`, 'DELETE'),
  },
  vposts: {
    list: () => apiAction('/vposts/'),
    create: (data) => apiAction('/vposts/', 'POST', data, true),
    delete: (id) => apiAction(`/vposts/${id}/`, 'DELETE'),
  },
  clients: {
    list: () => apiAction('/clients/'),
    create: (data) => apiAction('/clients/', 'POST', data, true),
    update: (id, data) => apiAction(`/clients/${id}/`, 'PATCH', data, true),
    delete: (id) => apiAction(`/clients/${id}/`, 'DELETE'),
  },
  messages: {
    list: () => apiAction('/contact/'),
    delete: (id) => apiAction(`/contact/${id}/`, 'DELETE'),
    reply: (id, text) => apiAction(`/contact/${id}/reply/`, 'POST', { reply_text: text }),
    convertToSubscriber: (id) => apiAction(`/contact/${id}/add_to_subscribers/`, 'POST'),
  },
  newsletter: {
    list: () => apiAction('/newsletter/'),
    delete: (id) => apiAction(`/newsletter/${id}/`, 'DELETE'),
    subscribe: (email, name = '') => apiAction('/newsletter/', 'POST', { email, name }),
    exportUrl: () => `${API_BASE}/newsletter/export_csv/`,
  },
  campaigns: {
    list: () => apiAction('/campaigns/'),
    create: (data) => apiAction('/campaigns/', 'POST', data),
    delete: (id) => apiAction(`/campaigns/${id}/`, 'DELETE'),
    send: (id) => apiAction(`/campaigns/${id}/send_campaign/`, 'POST'),
  },
  templates: {
    list: () => apiAction('/templates/'),
    create: (data) => apiAction('/templates/', 'POST', data),
    update: (id, data) => apiAction(`/templates/${id}/`, 'PUT', data),
    delete: (id) => apiAction(`/templates/${id}/`, 'DELETE'),
  },
  notifications: {
    list: () => apiAction('/notifications/'),
    markAllRead: () => apiAction('/notifications/mark_all_read/', 'POST'),
    delete: (id) => apiAction(`/notifications/${id}/`, 'DELETE'),
  },
  gallery: {
    list: () => apiAction('/gallery/'),
    create: (data) => apiAction('/gallery/', 'POST', data, true),
    delete: (id) => apiAction(`/gallery/${id}/`, 'DELETE'),
  },
  team: {
    list: () => apiAction('/team/'),
    create: (data) => apiAction('/team/', 'POST', data, true),
    delete: (id) => apiAction(`/team/${id}/`, 'DELETE'),
  },
  telegramUsers: {
    list: () => apiAction('/telegram/users/'),
    create: (data) => apiAction('/telegram/users/', 'POST', data),
    update: (id, data) => apiAction(`/telegram/users/${id}/`, 'PUT', data),
    delete: (id) => apiAction(`/telegram/users/${id}/`, 'DELETE'),
  },
  telegramAppointments: {
    list: () => apiAction('/telegram/appointments/'),
    create: (data) => apiAction('/telegram/appointments/', 'POST', data),
    update: (id, data) => apiAction(`/telegram/appointments/${id}/`, 'PUT', data),
    delete: (id) => apiAction(`/telegram/appointments/${id}/`, 'DELETE'),
    sendConfirmation: (id) => apiAction(`/telegram/appointments/${id}/send_confirmation/`, 'POST'),
    sendReminder: (id) => apiAction(`/telegram/appointments/${id}/send_reminder/`, 'POST'),
  },
  telegramCampaigns: {
    list: () => apiAction('/telegram/campaigns/'),
    create: (data) => apiAction('/telegram/campaigns/', 'POST', data),
    delete: (id) => apiAction(`/telegram/campaigns/${id}/`, 'DELETE'),
  },
  telegramTags: {
    list: () => apiAction('/telegram/tags/'),
    create: (data) => apiAction('/telegram/tags/', 'POST', data),
    delete: (id) => apiAction(`/telegram/tags/${id}/`, 'DELETE'),
  },
  telegramLogs: {
    list: () => apiAction('/telegram/logs/'),
  },
  telegramSendDirect: (chat_ids, message, files = []) => {
    const token = localStorage.getItem('adminToken');
    const form = new FormData();
    form.append('chat_ids', JSON.stringify(chat_ids));
    form.append('message', message);
    files.forEach(f => form.append('files', f));
    return fetch(`${API_BASE}/telegram/send-direct/`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Token ${token}` } : {},
      body: form
    }).then(async r => {
      if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || `HTTP ${r.status}`); }
      return r.json();
    });
  },
  patients: {
    list: () => apiAction('/patients/'),
    create: (data) => apiAction('/patients/', 'POST', data),
    update: (id, data) => apiAction(`/patients/${id}/`, 'PUT', data),
    delete: (id) => apiAction(`/patients/${id}/`, 'DELETE'),
  },
  products: {
    list: () => apiAction('/products/'),
    create: (data) => apiAction('/products/', 'POST', data, true),
    update: (id, data) => apiAction(`/products/${id}/`, 'PATCH', data, true),
    delete: (id) => apiAction(`/products/${id}/`, 'DELETE'),
  },
  inventory: {
    list: () => apiAction('/inventory/'),
    create: (data) => apiAction('/inventory/', 'POST', data),
    update: (id, data) => apiAction(`/inventory/${id}/`, 'PUT', data),
    delete: (id) => apiAction(`/inventory/${id}/`, 'DELETE'),
  },
  employees: {
    list: () => apiAction('/employees/'),
    create: (data) => apiAction('/employees/', 'POST', data),
    update: (id, data) => apiAction(`/employees/${id}/`, 'PUT', data),
    delete: (id) => apiAction(`/employees/${id}/`, 'DELETE'),
  },
  schedules: {
    list: () => apiAction('/schedules/'),
    create: (data) => apiAction('/schedules/', 'POST', data),
    update: (id, data) => apiAction(`/schedules/${id}/`, 'PUT', data),
    delete: (id) => apiAction(`/schedules/${id}/`, 'DELETE'),
  },
};

// 📌 Legacy Named Exports (required by Hero, Services, Blog, etc.)
export const fetchServices = () => api.services.list();
export const fetchBlogPosts = () => api.posts.list();
export const fetchVideoPosts = () => api.vposts.list();
export const fetchClients = () => api.clients.list();
export const fetchMessages = () => api.messages.list();
export const fetchReviews = () => api.reviews.list();
export const fetchTeam = () => api.team.list();
export const createContactMessage = (data) => api.messages.create(data);

export async function fetchChatData(messages) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  };
  const res = await fetch(`${API_BASE}/chat/`, options);
  if (!res.ok) throw new Error('Failed to fetch chat response');
  return res.json();
}
