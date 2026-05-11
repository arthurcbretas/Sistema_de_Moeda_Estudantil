import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { empresaApi } from '../../services/api';
import { Building2, Save, Check, Loader2 } from 'lucide-react';

export default function EmpresaForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const isPublicRegister = location.pathname.startsWith('/registrar');

  const [form, setForm] = useState({ nome: '', email: '', senha: '', cnpj: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEditing) {
      empresaApi.buscar(id).then((res) => {
        const e = res.data;
        setForm({ nome: e.nome, email: e.email, senha: '', cnpj: e.cnpj });
      }).catch(() => showToast('Erro ao carregar empresa', 'error'));
    }
  }, [id, isEditing]);

  const validate = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!form.email.trim()) errs.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email inválido';
    if (!isEditing && !form.senha) errs.senha = 'Senha é obrigatória';
    else if (form.senha && form.senha.length < 6) errs.senha = 'Mínimo 6 caracteres';
    if (!form.cnpj.trim()) errs.cnpj = 'CNPJ é obrigatório';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, senha: form.senha || undefined };
      if (isEditing) {
        await empresaApi.atualizar(id, payload);
        showToast('Empresa atualizada!', 'success');
      } else {
        await empresaApi.cadastrar(payload);
        showToast('Empresa cadastrada!', 'success');
      }
      setTimeout(() => navigate(isPublicRegister ? '/login' : '/admin/empresas'), 1000);
    } catch (err) {
      if (err.details) setErrors(err.details);
      else showToast(err.message || 'Erro ao salvar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><Building2 size={32} /></span>{isPublicRegister ? 'Cadastro de Empresa' : isEditing ? 'Editar Empresa' : 'Nova Empresa'}</h1>
        <p className="subtitle">{isPublicRegister ? 'Cadastre sua empresa para oferecer vantagens' : isEditing ? 'Atualize os dados da empresa' : 'Cadastre uma nova empresa parceira'}</p>
      </div>
      <div className="card" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit} id="form-empresa">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input className={`form-input ${errors.nome ? 'error' : ''}`} type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da empresa" id="input-nome" />
              {errors.nome && <span className="form-error">{errors.nome}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="empresa@email.com" id="input-email" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Senha {isEditing ? '(vazio = manter)' : '*'}</label>
              <input className={`form-input ${errors.senha ? 'error' : ''}`} type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" id="input-senha" />
              {errors.senha && <span className="form-error">{errors.senha}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">CNPJ *</label>
              <input className={`form-input ${errors.cnpj ? 'error' : ''}`} type="text" name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" id="input-cnpj" />
              {errors.cnpj && <span className="form-error">{errors.cnpj}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(isPublicRegister ? '/registrar' : '/admin/empresas')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="btn-salvar-empresa">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : isEditing ? <><Save size={16} /> Atualizar</> : <><Check size={16} /> Cadastrar</>}
            </button>
          </div>
        </form>
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
