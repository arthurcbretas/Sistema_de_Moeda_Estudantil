import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { alunoApi, instituicaoApi } from '../../services/api';
import { GraduationCap, Save, Check, Loader2 } from 'lucide-react';

export default function AlunoForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    nome: '', email: '', senha: '', cpf: '',
    rg: '', endereco: '', curso: '', instituicaoId: '',
  });
  const [instituicoes, setInstituicoes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    instituicaoApi.listar()
      .then((res) => setInstituicoes(res.data))
      .catch(() => {});

    if (isEditing) {
      alunoApi.buscar(id).then((res) => {
        const a = res.data;
        setForm({
          nome: a.nome || '', email: a.email || '', senha: '',
          cpf: a.cpf || '', rg: a.rg || '', endereco: a.endereco || '',
          curso: a.curso || '', instituicaoId: a.instituicaoId || '',
        });
      }).catch(() => {
        showToast('Erro ao carregar dados do aluno', 'error');
      });
    }
  }, [id, isEditing]);

  const validate = () => {
    const errs = {};
    if (!form.nome.trim()) errs.nome = 'Nome é obrigatório';
    if (!form.email.trim()) errs.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email inválido';
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
        await alunoApi.atualizar(id, payload);
        showToast('Aluno atualizado com sucesso!', 'success');
      } else {
        await alunoApi.cadastrar(payload);
        showToast('Aluno cadastrado com sucesso!', 'success');
      }
      setTimeout(() => navigate('/alunos'), 1000);
    } catch (err) {
      if (err.details) {
        setErrors(err.details);
      } else {
        showToast(err.message || 'Erro ao salvar aluno', 'error');
      }
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
        <h1>
          <span className="icon" style={{ display: 'flex' }}><GraduationCap size={32} /></span>
          {isEditing ? 'Editar Aluno' : 'Novo Aluno'}
        </h1>
        <p className="subtitle">
          {isEditing ? 'Atualize os dados do aluno' : 'Cadastre um novo aluno no sistema'}
        </p>
      </div>

      <div className="card" style={{ maxWidth: '700px' }}>
        <form onSubmit={handleSubmit} id="form-aluno">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input
                className={`form-input ${errors.nome ? 'error' : ''}`}
                type="text" name="nome" value={form.nome}
                onChange={handleChange} placeholder="Nome completo"
                id="input-nome"
              />
              {errors.nome && <span className="form-error">{errors.nome}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                className={`form-input ${errors.email ? 'error' : ''}`}
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="aluno@email.com"
                id="input-email"
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Senha {isEditing ? '(deixe vazio para manter)' : '*'}</label>
              <input
                className={`form-input ${errors.senha ? 'error' : ''}`}
                type="password" name="senha" value={form.senha}
                onChange={handleChange} placeholder="Mínimo 6 caracteres"
                id="input-senha"
              />
              {errors.senha && <span className="form-error">{errors.senha}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">CPF *</label>
              <input
                className={`form-input ${errors.cpf ? 'error' : ''}`}
                type="text" name="cpf" value={form.cpf}
                onChange={handleChange} placeholder="000.000.000-00"
                id="input-cpf"
              />
              {errors.cpf && <span className="form-error">{errors.cpf}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">RG</label>
              <input
                className="form-input" type="text" name="rg"
                value={form.rg} onChange={handleChange} placeholder="RG"
                id="input-rg"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Curso</label>
              <input
                className="form-input" type="text" name="curso"
                value={form.curso} onChange={handleChange} placeholder="Ex: Engenharia de Software"
                id="input-curso"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Endereço</label>
            <input
              className="form-input" type="text" name="endereco"
              value={form.endereco} onChange={handleChange}
              placeholder="Endereço completo"
              id="input-endereco"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Instituição de Ensino</label>
            <select
              className="form-select" name="instituicaoId"
              value={form.instituicaoId} onChange={handleChange}
              id="select-instituicao"
            >
              <option value="">Selecione uma instituição...</option>
              {instituicoes.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/alunos')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} id="btn-salvar-aluno">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : isEditing ? <><Save size={16} /> Atualizar</> : <><Check size={16} /> Cadastrar</>}
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
