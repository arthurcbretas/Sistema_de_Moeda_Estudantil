import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { alunoApi } from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import { GraduationCap, Plus, Pencil, Trash2, CircleDollarSign } from 'lucide-react';

export default function AlunoList() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchAlunos = async () => {
    try {
      const res = await alunoApi.listar();
      setAlunos(res.data);
    } catch (err) {
      showToast('Erro ao carregar alunos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlunos(); }, []);

  const handleDelete = async () => {
    try {
      await alunoApi.remover(deleteTarget.id);
      setAlunos((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      showToast(`Aluno "${deleteTarget.nome}" removido com sucesso!`, 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao remover aluno', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-container"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>
          <span className="icon" style={{ display: 'flex' }}><GraduationCap size={32} /></span>
          Alunos
        </h1>
        <p className="subtitle">Gerenciamento de alunos cadastrados no sistema</p>
      </div>

      <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'flex-end' }}>
        <Link to="/alunos/novo" className="btn btn-primary" id="btn-novo-aluno">
          <Plus size={18} /> Novo Aluno
        </Link>
      </div>

      {alunos.length === 0 ? (
        <div className="empty-state">
          <div className="icon" style={{ display: 'flex', justifyContent: 'center' }}><GraduationCap size={48} /></div>
          <p>Nenhum aluno cadastrado ainda.</p>
          <Link to="/alunos/novo" className="btn btn-primary">
            Cadastrar Primeiro Aluno
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table id="tabela-alunos">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Curso</th>
                <th>Instituição</th>
                <th>Saldo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    {aluno.nome}
                  </td>
                  <td>{aluno.email}</td>
                  <td>{aluno.cpf}</td>
                  <td>{aluno.curso || '—'}</td>
                  <td>{aluno.instituicaoNome || '—'}</td>
                  <td>
                    <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CircleDollarSign size={14} /> {aluno.saldoMoedas}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/alunos/editar/${aluno.id}`}
                        className="btn btn-secondary btn-sm"
                        id={`btn-editar-aluno-${aluno.id}`}
                      >
                        <Pencil size={14} /> Editar
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteTarget(aluno)}
                        id={`btn-remover-aluno-${aluno.id}`}
                      >
                        <Trash2 size={14} /> Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Remover Aluno"
          message={`Tem certeza que deseja remover "${deleteTarget.nome}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`} id="toast-msg">
          {toast.msg}
        </div>
      )}
    </div>
  );
}
