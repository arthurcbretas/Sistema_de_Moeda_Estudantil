import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { instituicaoApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';

export default function InstituicaoList() {
  const [instituicoes, setInstituicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    instituicaoApi.listar()
      .then((res) => setInstituicoes(res.data))
      .catch(() => showToast('Erro ao carregar instituições', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await instituicaoApi.remover(deleteTarget.id);
      setInstituicoes((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      showToast('Instituição removida!', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
    setDeleteTarget(null);
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <div className="main-content"><div className="loading-container"><div className="spinner"></div></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><Building2 size={32} /></span>Instituições de Ensino</h1>
        <p className="subtitle">Gerenciamento de instituições cadastradas</p>
      </div>
      <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'flex-end' }}>
        <Link to="/admin/instituicoes/nova" className="btn btn-primary"><Plus size={18} /> Nova Instituição</Link>
      </div>
      {instituicoes.length === 0 ? (
        <div className="empty-state">
          <div className="icon" style={{ display: 'flex', justifyContent: 'center' }}><Building2 size={48} /></div>
          <p>Nenhuma instituição cadastrada.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead><tr><th>Nome</th><th>Endereço</th><th>Ações</th></tr></thead>
            <tbody>
              {instituicoes.map((i) => (
                <tr key={i.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{i.nome}</td>
                  <td>{i.endereco || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/instituicoes/editar/${i.id}`} className="btn btn-secondary btn-sm"><Pencil size={14} /> Editar</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(i)}><Trash2 size={14} /> Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleteTarget && <ConfirmDialog title="Remover Instituição" message={`Remover "${deleteTarget.nome}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
