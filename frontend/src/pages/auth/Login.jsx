import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', senha: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email é obrigatório';
    if (!form.senha) errs.senha = 'Senha é obrigatória';
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
      const res = await authApi.login(form);
      const { token, role, userId, nome, email } = res.data;
      login({ role, userId, nome, email }, token);
      showToast('Login realizado com sucesso!', 'success');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      showToast(err.message || 'Credenciais inválidas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <LogIn size={40} color="var(--accent-gold)" />
          <h2 style={{ marginTop: 'var(--space-md)' }}>Entrar</h2>
          <p className="subtitle">Acesse o Sistema de Moeda Estudantil</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input ${errors.email ? 'error' : ''}`}
              type="email" name="email" value={form.email}
              onChange={handleChange} placeholder="seu@email.com"
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className={`form-input ${errors.senha ? 'error' : ''}`}
              type="password" name="senha" value={form.senha}
              onChange={handleChange} placeholder="Sua senha"
            />
            {errors.senha && <span className="form-error">{errors.senha}</span>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : <><LogIn size={16} /> Entrar</>}
          </button>
        </form>
      </div>

      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
