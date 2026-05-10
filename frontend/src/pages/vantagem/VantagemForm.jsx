import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vantagemApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Save, Check, Loader2 } from 'lucide-react';

export default function VantagemForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { user } = useAuth();

  const [form, setForm] = useState({ descricao: '', fotoUrl: '', custoMoedas: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEditing) {
      vantagemApi.buscar(id).then((res) => {
        const v = res.data;
        setForm({ descricao: v.descricao || '', fotoUrl: v.fotoUrl || '', custoMoedas: v.custoMoedas || '' });
      }).catch(() => showToast('Erro ao carregar vantagem', 'error'));
    }
  }, [id, isEditing]);

  const validate = () => {
    const errs = {};
    if (!form.descricao.trim()) errs.descricao = 'Descrição é obrigatória';
    if (!form.custoMoedas || Number(form.custoMoedas) < 1) errs.custoMoedas = 'Custo deve ser maior que zero';
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
        descricao: form.descricao,
        fotoUrl: form.fotoUrl || null,
        custoMoedas: Number(form.custoMoedas),
        empresaId: user.userId,
      };
      if (isEditing) {
        await vantagemApi.atualizar(id, payload);
        showToast('Vantagem atualizada!', 'success');
      } else {
        await vantagemApi.cadastrar(payload);
        showToast('Vantagem cadastrada!', 'success');
      }
      setTimeout(() => navigate('/vantagens'), 1000);
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
        <h1><span className="icon" style={{ display: 'flex' }}><Ticket size={32} /></span>{isEditing ? 'Editar Vantagem' : 'Nova Vantagem'}</h1>
        <p className="subtitle">{isEditing ? 'Atualize os dados da vantagem' : 'Cadastre uma nova vantagem para os alunos'}</p>
      </div>
      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Descrição *</label>
            <textarea className={`form-input ${errors.descricao ? 'error' : ''}`} name="descricao" value={form.descricao} onChange={handleChange} placeholder="Descreva a vantagem..." rows={3} style={{ resize: 'vertical' }} />
            {errors.descricao && <span className="form-error">{errors.descricao}</span>}
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">URL da Foto</label>
              <input className="form-input" type="text" name="fotoUrl" value={form.fotoUrl} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label className="form-label">Custo em Moedas *</label>
              <input className={`form-input ${errors.custoMoedas ? 'error' : ''}`} type="number" name="custoMoedas" value={form.custoMoedas} onChange={handleChange} placeholder="Ex: 100" min="1" />
              {errors.custoMoedas && <span className="form-error">{errors.custoMoedas}</span>}
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/vantagens')}>Cancelar</button>
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
