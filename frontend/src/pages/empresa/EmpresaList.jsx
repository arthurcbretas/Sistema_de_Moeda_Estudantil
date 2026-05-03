import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { empresaApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Building2, Plus, Pencil, Trash2 } from 'lucide-react';

export default function EmpresaList() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    empresaApi.listar()
      .then((res) => setEmpresas(res.data))
      .catch(() => showToast('Erro ao carregar empresas', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await empresaApi.remover(deleteTarget.id);
      setEmpresas((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      showToast('Empresa removida!', 'success');
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
        <h1><span className="icon" style={{ display: 'flex' }}><Building2 size={32} /></span>Empresas Parceiras</h1>
        <p className="subtitle">Gerenciamento de empresas parceiras</p>
      </div>
      <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'flex-end' }}>
        <Link to="/empresas/nova" className="btn btn-primary" id="btn-nova-empresa"><Plus size={18} /> Nova Empresa</Link>
      </div>
      {empresas.length === 0 ? (
        <div className="empty-state">
          <div className="icon" style={{ display: 'flex', justifyContent: 'center' }}><Building2 size={48} /></div>
          <p>Nenhuma empresa cadastrada.</p>
          <Link to="/empresas/nova" className="btn btn-primary">Cadastrar Primeira Empresa</Link>
        </div>
      ) : (
        <div className="table-container">
          <table id="tabela-empresas">
            <thead><tr><th>Nome</th><th>Email</th><th>CNPJ</th><th>Ações</th></tr></thead>
            <tbody>
              {empresas.map((e) => (
                <tr key={e.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{e.nome}</td>
                  <td>{e.email}</td>
                  <td>{e.cnpj}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/empresas/editar/${e.id}`} className="btn btn-secondary btn-sm"><Pencil size={14} /> Editar</Link>
                      <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(e)}><Trash2 size={14} /> Remover</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {deleteTarget && <ConfirmDialog title="Remover Empresa" message={`Remover "${deleteTarget.nome}"?`} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
