const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

async function request(path, options = {}) {
  const token = localStorage.getItem('innova_token')
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Error ${res.status}`)
  }
  return data
}

export const api = {
  health: () => request('/api/health'),
  categorias: () => request('/api/categorias'),
  servicios: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return request(`/api/servicios${qs ? `?${qs}` : ''}`)
  },
  servicio: (id) => request(`/api/servicios/${id}`),
  misServicios: () => request('/api/servicios/vendedor/mios'),
  crearServicio: (body) =>
    request('/api/servicios', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  registro: (body) =>
    request('/api/auth/registro', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request('/api/auth/me'),
  crearPedido: (body) =>
    request('/api/pedidos', { method: 'POST', body: JSON.stringify(body) }),
  misPedidos: () => request('/api/pedidos/mios'),
  actualizarPedido: (id, estado) =>
    request(`/api/pedidos/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),
  enviarEncuesta: (id, body) =>
    request(`/api/encuestas/${id}/respuestas`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  resultadosEncuesta: (id) => request(`/api/encuestas/${id}/resultados`),
  adminMetrics: () => request('/api/admin/metrics'),
  adminUsuarios: () => request('/api/admin/usuarios'),
  aprobarServicio: (id, estado) =>
    request(`/api/admin/servicios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado }),
    }),
  contacto: (body) =>
    request('/api/contacto', { method: 'POST', body: JSON.stringify(body) }),
}

export function formatCOP(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}
