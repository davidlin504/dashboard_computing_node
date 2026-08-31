const API_BASE = 'http://192.168.87.198:8000'

export const API = {
  'hosts': `${API_BASE}/hosts`,
  'static_hosts': `./status.json`,
  'login': `${API_BASE}/auth/login`,
  'logout': `${API_BASE}/auth/logout`,
  'power': `${API_BASE}/power`,
}