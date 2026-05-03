import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de resposta — tratamento centralizado de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      'Erro de conexão com o servidor';
    
    console.error('[API Error]', message, error.response?.data);
    return Promise.reject({ message, details: error.response?.data?.details });
  }
);

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
// INSTITUIÇÃO DE ENSINO API
// ══════════════════════════════════════
export const instituicaoApi = {
  listar: () => api.get('/instituicoes'),
};

export default api;
