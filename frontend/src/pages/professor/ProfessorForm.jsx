import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { professorApi, instituicaoApi } from '../../services/api';
import { Users, Save, Check, Loader2 } from 'lucide-react';

export default function ProfessorForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    nome: '', email: '', senha: '', cpf: '',
    departamento: '', instituicaoId: '',
  });
  const [instituicoes, setInstituicoes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    instituicaoApi.listar().then((res) => setInstituicoes(res.data)).catch(() => {});
    if (isEditing) {
      professorApi.buscar(id).then((res) => {
        const p = res.data;
        setForm({
          nome: p.nome || '', email: p.email || '', senha: '',
          cpf: p.cpf || '', departamento: p.departamento || '',
          instituicaoId: p.instituicaoId || '',
        });
      }).catch(() => showToast('Erro ao carregar professor', 'error'));
    }
  }, [id, isEditing]);

  const validate = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!form.email.trim()) errs.email = 'Email é obrigatório';
    if (!isEditing && !form.senha) errs.senha = 'Senha é obrigatória';
    else if (form.senha && form.senha.length < 6) errs.senha = 'Mínimo 6 caracteres';
    if (!form.cpf.trim()) errs.cpf = 'CPF é obrigatório';
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
      const payload = {
        ...form,
        instituicaoId: form.instituicaoId ? Number(form.instituicaoId) : null,
        senha: form.senha || undefined,
      };
      if (isEditing) {
        await professorApi.atualizar(id, payload);
        showToast('Professor atualizado!', 'success');
      } else {
        await professorApi.cadastrar(payload);
        showToast('Professor cadastrado!', 'success');
      }
      setTimeout(() => navigate('/professores'), 1000);
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
        <h1><span className="icon" style={{ display: 'flex' }}><Users size={32} /></span>{isEditing ? 'Editar Professor' : 'Novo Professor'}</h1>
        <p className="subtitle">{isEditing ? 'Atualize os dados do professor' : 'Cadastre um novo professor'}</p>
      </div>
      <div className="card" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input className={`form-input ${errors.nome ? 'error' : ''}`} type="text" name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" />
              {errors.nome && <span className="form-error">{errors.nome}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="professor@email.com" />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Senha {isEditing ? '(vazio = manter)' : '*'}</label>
              <input className={`form-input ${errors.senha ? 'error' : ''}`} type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="Mínimo 6 caracteres" />
              {errors.senha && <span className="form-error">{errors.senha}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">CPF *</label>
              <input className={`form-input ${errors.cpf ? 'error' : ''}`} type="text" name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" />
              {errors.cpf && <span className="form-error">{errors.cpf}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Departamento</label>
              <input className="form-input" type="text" name="departamento" value={form.departamento} onChange={handleChange} placeholder="Ex: Engenharia de Software" />
            </div>
            <div className="form-group">
              <label className="form-label">Instituição</label>
              <select className="form-select" name="instituicaoId" value={form.instituicaoId} onChange={handleChange}>
                <option value="">Selecione...</option>
                {instituicoes.map((inst) => <option key={inst.id} value={inst.id}>{inst.nome}</option>)}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/professores')}>Cancelar</button>
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
