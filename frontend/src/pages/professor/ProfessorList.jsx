import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { professorApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Users, Plus, Pencil, Trash2, CircleDollarSign, Upload } from 'lucide-react';

export default function ProfessorList() {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchProfessores = async () => {
    try {
      const res = await professorApi.listar();
      setProfessores(res.data);
    } catch {
      showToast('Erro ao carregar professores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfessores(); }, []);

  const handleDelete = async () => {
    try {
      await professorApi.remover(deleteTarget.id);
      setProfessores((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast('Professor removido!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setDeleteTarget(null);
  };

  const handleCsvUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await professorApi.uploadCsv(file);
      showToast(`${res.data.length} professor(es) importado(s)!`, 'success');
      fetchProfessores();
    } catch (err) {
      showToast(err.message || 'Erro ao importar CSV', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <div className="main-content"><div className="loading-container"><div className="spinner"></div></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><Users size={32} /></span>Professores</h1>
        <p className="subtitle">Gerenciamento de professores cadastrados</p>
      </div>
      <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
        <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
          <Upload size={18} /> {uploading ? 'Importando...' : 'Importar CSV'}
          <input type="file" accept=".csv" onChange={handleCsvUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
        <Link to="/professores/novo" className="btn btn-primary"><Plus size={18} /> Novo Professor</Link>
      </div>
      {professores.length === 0 ? (
        <div className="empty-state">
          <div className="icon" style={{ display: 'flex', justifyContent: 'center' }}><Users size={48} /></div>
          <p>Nenhum professor cadastrado.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Nome</th><th>Email</th><th>CPF</th><th>Departamento</th><th>Instituição</th><th>Saldo</th><th>Ações</th></tr></thead>
            <tbody>
              {professores.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{p.nome}</td>
                  <td>{p.email}</td>
                  <td>{p.cpf}</td>
                  <td>{p.departamento || '—'}</td>
                  <td>{p.instituicaoNome || '—'}</td>
                  <td><span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CircleDollarSign size={14} /> {p.saldoMoedas}</span></td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/professores/editar/${p.id}`} className="btn btn-secondary btn-sm"><Pencil size={14} /> Editar</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(p)}><Trash2 size={14} /> Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleteTarget && <ConfirmDialog title="Remover Professor" message={`Remover "${deleteTarget.nome}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
