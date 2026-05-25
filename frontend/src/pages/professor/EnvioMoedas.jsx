import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moedaApi, alunoApi, professorApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Send, Loader2, CircleDollarSign } from 'lucide-react';

export default function EnvioMoedas() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alunos, setAlunos] = useState([]);
  const [professorSaldo, setProfessorSaldo] = useState(null);
  const [form, setForm] = useState({ alunoId: '', valor: '', motivo: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    alunoApi.listar().then((res) => setAlunos(res.data)).catch(() => {});
    if (user?.userId) {
      professorApi.buscar(user.userId)
        .then((res) => setProfessorSaldo(res.data?.saldoMoedas))
        .catch(() => {});
    }
  }, [user]);

  const validate = () => {
    const errs = {};
    if (!form.alunoId) errs.alunoId = 'Selecione um aluno';
    if (!form.valor || Number(form.valor) < 1) errs.valor = 'Valor deve ser maior que zero';
    if (!form.motivo.trim()) errs.motivo = 'Motivo é obrigatório';
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
      await moedaApi.enviar({
        alunoId: Number(form.alunoId),
        valor: Number(form.valor),
        motivo: form.motivo,
      });
      showToast('Moedas enviadas com sucesso!', 'success');
      setForm({ alunoId: '', valor: '', motivo: '' });
      if (professorSaldo !== null) {
        setProfessorSaldo(prev => prev - Number(form.valor));
      }
    } catch (err) {
      showToast(err.message || 'Erro ao enviar moedas', 'error');
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h1><span className="icon" style={{ display: 'flex' }}><Send size={32} /></span>Enviar Moedas</h1>
          <p className="subtitle">Reconheça um aluno enviando moedas</p>
        </div>
        {professorSaldo !== null && (
          <div className="card" style={{ padding: 'var(--space-sm) var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', margin: 0 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seu saldo:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CircleDollarSign size={20} /> {professorSaldo}
            </span>
          </div>
        )}
      </div>
      <div className="card" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Aluno *</label>
            <select className={`form-select ${errors.alunoId ? 'error' : ''}`} name="alunoId" value={form.alunoId} onChange={handleChange}>
              <option value="">Selecione um aluno...</option>
              {alunos.map((a) => <option key={a.id} value={a.id}>{a.nome} ({a.email})</option>)}
            </select>
            {errors.alunoId && <span className="form-error">{errors.alunoId}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Quantidade de moedas *</label>
            <input className={`form-input ${errors.valor ? 'error' : ''}`} type="number" name="valor" value={form.valor} onChange={handleChange} placeholder="Ex: 50" min="1" />
            {errors.valor && <span className="form-error">{errors.valor}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Motivo *</label>
            <textarea className={`form-input ${errors.motivo ? 'error' : ''}`} name="motivo" value={form.motivo} onChange={handleChange} placeholder="Descreva o motivo do reconhecimento..." rows={3} style={{ resize: 'vertical' }} />
            {errors.motivo && <span className="form-error">{errors.motivo}</span>}
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Send size={16} /> Enviar Moedas</>}
            </button>
          </div>
        </form>
      </div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
