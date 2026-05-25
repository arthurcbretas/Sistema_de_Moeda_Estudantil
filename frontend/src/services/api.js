import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request — injeta JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sme-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de resposta — tratamento centralizado de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sme-token');
      localStorage.removeItem('sme-user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Erro de conexão com o servidor';
    
    console.error('[API Error]', message, error.response?.data);
    return Promise.reject({ message, details: error.response?.data?.details });
  }
);

// ══════════════════════════════════════
// AUTH API
// ══════════════════════════════════════
export const authApi = {
  login: (data) => api.post('/auth/login', data),
};

// ══════════════════════════════════════
// ALUNO API
// ══════════════════════════════════════
export const alunoApi = {
  listar: () => api.get('/alunos'),
  buscar: (id) => api.get(`/alunos/${id}`),
  cadastrar: (data) => api.post('/alunos', data),
  atualizar: (id, data) => api.put(`/alunos/${id}`, data),
  remover: (id) => api.delete(`/alunos/${id}`),
};

// ══════════════════════════════════════
// EMPRESA PARCEIRA API
// ══════════════════════════════════════
export const empresaApi = {
  listar: () => api.get('/empresas'),
  buscar: (id) => api.get(`/empresas/${id}`),
  cadastrar: (data) => api.post('/empresas', data),
  atualizar: (id, data) => api.put(`/empresas/${id}`, data),
  remover: (id) => api.delete(`/empresas/${id}`),
};

// ══════════════════════════════════════
// PROFESSOR API
// ══════════════════════════════════════
export const professorApi = {
  listar: () => api.get('/professores'),
  buscar: (id) => api.get(`/professores/${id}`),
  cadastrar: (data) => api.post('/professores', data),
  atualizar: (id, data) => api.put(`/professores/${id}`, data),
  remover: (id) => api.delete(`/professores/${id}`),
  uploadCsv: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/professores/upload-csv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// ══════════════════════════════════════
// INSTITUIÇÃO DE ENSINO API
// ══════════════════════════════════════
export const instituicaoApi = {
  listar: () => api.get('/instituicoes'),
  buscar: (id) => api.get(`/instituicoes/${id}`),
  cadastrar: (data) => api.post('/instituicoes', data),
  atualizar: (id, data) => api.put(`/instituicoes/${id}`, data),
  remover: (id) => api.delete(`/instituicoes/${id}`),
};

// ══════════════════════════════════════
// VANTAGEM API
// ══════════════════════════════════════
export const vantagemApi = {
  listar: (empresaId) => api.get('/vantagens', { params: empresaId ? { empresaId } : {} }),
  buscar: (id) => api.get(`/vantagens/${id}`),
  cadastrar: (data) => api.post('/vantagens', data),
  atualizar: (id, data) => api.put(`/vantagens/${id}`, data),
  remover: (id) => api.delete(`/vantagens/${id}`),
};

// ══════════════════════════════════════
// MOEDAS API
// ══════════════════════════════════════
export const moedaApi = {
  enviar: (data) => api.post('/moedas/enviar', data),
};

// ══════════════════════════════════════
// RESGATE API
// ══════════════════════════════════════
export const resgateApi = {
  resgatar: (data) => api.post('/resgates', data),
  meusCupons: () => api.get('/resgates/meus-cupons'),
};

// ══════════════════════════════════════
// EXTRATO API
// ══════════════════════════════════════
export const extratoApi = {
  consultar: () => api.get('/extrato'),
};

export default api;
