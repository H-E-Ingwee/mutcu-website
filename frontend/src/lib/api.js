import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

let authToken = localStorage.getItem('mutcu_website_token') || null

export function setToken(token) {
  authToken = token
  if (token) localStorage.setItem('mutcu_website_token', token)
  else localStorage.removeItem('mutcu_website_token')
}

export function getToken() { return authToken }

async function request(method, path, body, opts = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    ...opts,
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const msg = data.error || data.message || `Request failed (${res.status})`
    throw Object.assign(new Error(msg), { response: { data, status: res.status } })
  }

  return data
}

const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}

export default api

// ─── Domain APIs ──────────────────────────────────────────────────────────────

export const leadershipAPI = {
  getAll: (year) => api.get(`/leadership${year ? `?spiritual_year=${year}` : ''}`),
  getPatrons: () => api.get('/leadership/patrons'),
  getByRole: (slug) => api.get(`/leadership/role/${slug}`),
  getYears: () => api.get('/leadership/years'),
  create: (data) => api.post('/leadership', data),
  update: (id, data) => api.put(`/leadership/${id}`, data),
  delete: (id) => api.delete(`/leadership/${id}`),
}

export const eventsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/events${q ? `?${q}` : ''}`)
  },
  getFeatured: () => api.get('/events/featured'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
}

export const blogsAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/blogs${q ? `?${q}` : ''}`)
  },
  getAllAdmin: () => api.get('/blogs/all'),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
  update: (id, data) => api.put(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
}

export const galleryAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/gallery${q ? `?${q}` : ''}`)
  },
  getCategories: () => api.get('/gallery/categories'),
  create: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
  delete: (id) => api.delete(`/gallery/${id}`),
}

export const resourcesAPI = {
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/resources${q ? `?${q}` : ''}`)
  },
  create: (data) => api.post('/resources', data),
  update: (id, data) => api.put(`/resources/${id}`, data),
  delete: (id) => api.delete(`/resources/${id}`),
}

export const prayerAPI = {
  submit: (data) => api.post('/prayer', data),
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/prayer${q ? `?${q}` : ''}`)
  },
  updateStatus: (id, status) => api.put(`/prayer/${id}/status`, { status }),
  delete: (id) => api.delete(`/prayer/${id}`),
}

export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
  getAll: () => api.get('/newsletter'),
  delete: (id) => api.delete(`/newsletter/${id}`),
}

export const contactAPI = {
  submit: (data) => api.post('/contact', data),
  getAll: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return api.get(`/contact${q ? `?${q}` : ''}`)
  },
  updateStatus: (id, status) => api.put(`/contact/${id}/status`, { status }),
  delete: (id) => api.delete(`/contact/${id}`),
}

export const ministriesAPI = {
  getAll: () => api.get('/ministries'),
  getBySlug: (slug) => api.get(`/ministries/${slug}`),
  create: (data) => api.post('/ministries', data),
  update: (id, data) => api.put(`/ministries/${id}`, data),
  delete: (id) => api.delete(`/ministries/${id}`),
}

export const aiAPI = {
  getPrayerEncouragement: (request, name) => api.post('/ai/prayer-encouragement', { request, name }),
  getDailyDevotional: () => api.get('/ai/devotional'),
  generateBlogDraft: (title, topic, tone) => api.post('/ai/blog-draft', { title, topic, tone }),
  getMinistryMatch: (answers) => api.post('/ai/ministry-match', answers),
  getStatus: () => api.get('/ai/status'),
}

export const adminAPI = {
  login: (email, password) => api.post('/admin/login', { email, password }),
  me: () => api.get('/admin/me'),
  dashboard: () => api.get('/admin/dashboard'),
  getTestimonials: () => api.get('/admin/testimonials'),
  createTestimonial: (data) => api.post('/admin/testimonials', data),
  updateTestimonial: (id, data) => api.put(`/admin/testimonials/${id}`, data),
  deleteTestimonial: (id) => api.delete(`/admin/testimonials/${id}`),
}