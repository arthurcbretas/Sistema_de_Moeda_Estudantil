import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { instituicaoApi } from '../../services/api';
import { Building2, Save, Check, Loader2 } from 'lucide-react';

export default function InstituicaoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({ nome: '', endereco: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEditing) {
      instituicaoApi.buscar(id).then((res) => {
        setForm({ nome: res.data.nome || '', endereco: res.data.endereco || '' });
      }).catch(() => showToast('Erro ao carregar instituição', 'error'));
    }
  }, [id, isEditing]);

  const validate = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
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
      if (isEditing) {
        await instituicaoApi.atualizar(id, form);
        showToast('Instituição atualizada!', 'success');
      } else {
        await instituicaoApi.cadastrar(form);
        showToast('Instituição cadastrada!', 'success');
      }
      setTimeout(() => navigate('/admin/instituicoes'), 1000);
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
        <h1><span className="icon" style={{ display: 'flex' }}><Building2 size={32} /></span>{isEditing ? 'Editar Instituição' : 'Nova Instituição'}</h1>
        <p className="subtitle">{isEditing ? 'Atualize os dados da instituição' : 'Cadastre uma nova instituição de ensino'}</p>
      </div>
      <div className="card" style={{ maxWidth: '500px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome *</label>
            <input className={`form-input ${errors.nome ? 'error' : ''}`} type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome da instituição" />
            {errors.nome && <span className="form-error">{errors.nome}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Endereço</label>
            <input className="form-input" type="text" name="endereco" value={form.endereco} onChange={handleChange} placeholder="Endereço completo" />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/instituicoes')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : isEditing ? <><Save size={16} /> Atualizar</> : <><Check size={16} /> Cadastrar</>}
            </button>
          </div>
        </form>
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
