import { useEffect, useState } from 'react';
import { extratoApi, alunoApi, professorApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ScrollText, CircleDollarSign, ArrowUpRight, ArrowDownLeft, RefreshCw, Filter, Ticket } from 'lucide-react';

export default function Extrato() {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saldo, setSaldo] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');

  useEffect(() => {
    const fetchPromises = [extratoApi.consultar()];
    if (user?.role === 'ALUNO') {
      fetchPromises.push(alunoApi.buscar(user.userId).catch(() => null));
    } else if (user?.role === 'PROFESSOR') {
      fetchPromises.push(professorApi.buscar(user.userId).catch(() => null));
    }

    Promise.all(fetchPromises)
      .then(([extratoRes, userRes]) => {
        setTransacoes(extratoRes.data || []);
        if (userRes) setSaldo(userRes.data?.saldoMoedas || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const transacoesFiltradas = transacoes.filter((t) => 
    filtroTipo === 'TODOS' ? true : t.tipo === filtroTipo
  );

  const totalRecebido = transacoes.filter(t => t.tipo === 'RECEBIMENTO' || t.tipo === 'RECARGA_SEMESTRAL').reduce((acc, t) => acc + t.valor, 0);
  const totalEnviado = transacoes.filter(t => t.tipo === 'ENVIO' || t.tipo === 'RESGATE').reduce((acc, t) => acc + t.valor, 0);

  const tipoIcon = (tipo) => {
    switch (tipo) {
      case 'ENVIO': return <ArrowUpRight size={16} color="var(--error)" />;
      case 'RECEBIMENTO': return <ArrowDownLeft size={16} color="var(--success)" />;
      case 'RESGATE': return <ArrowUpRight size={16} color="var(--warning)" />;
      case 'RECARGA_SEMESTRAL': return <RefreshCw size={16} color="var(--info)" />;
      default: return null;
    }
  };

  const tipoLabel = (tipo) => {
    switch (tipo) {
      case 'ENVIO': return 'Envio';
      case 'RECEBIMENTO': return 'Recebimento';
      case 'RESGATE': return 'Resgate';
      case 'RECARGA_SEMESTRAL': return 'Recarga Semestral';
      default: return tipo;
    }
  };

  if (loading) return <div className="main-content"><div className="loading-container"><div className="spinner"></div></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><ScrollText size={32} /></span>Extrato</h1>
        <p className="subtitle">Histórico de transações da sua conta</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ background: 'rgba(251, 191, 36, 0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', color: 'var(--accent-gold)' }}><CircleDollarSign size={24} /></div>
          <div><p className="subtitle">Saldo Atual</p><h3 style={{ margin: 0, fontSize: '1.5rem' }}>{saldo}</h3></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}><ArrowDownLeft size={24} /></div>
          <div><p className="subtitle">Total Recebido</p><h3 style={{ margin: 0, fontSize: '1.5rem' }}>{totalRecebido}</h3></div>
        </div>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}><ArrowUpRight size={24} /></div>
          <div><p className="subtitle">Total Enviado / Gasto</p><h3 style={{ margin: 0, fontSize: '1.5rem' }}>{totalEnviado}</h3></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <h3 style={{ margin: 0 }}>Lançamentos</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select className="form-input" style={{ width: 'auto', padding: '0.25rem 0.5rem' }} value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="TODOS">Todos</option>
            <option value="ENVIO">Envios</option>
            <option value="RECEBIMENTO">Recebimentos</option>
            <option value="RESGATE">Resgates</option>
            <option value="RECARGA_SEMESTRAL">Recargas</option>
          </select>
        </div>
      </div>
      {transacoes.length === 0 ? (
        <div className="empty-state">
          <div className="icon" style={{ display: 'flex', justifyContent: 'center' }}><ScrollText size={48} /></div>
          <p>Nenhuma transação registrada ainda.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Motivo</th>
                <th>{user?.role === 'PROFESSOR' ? 'Aluno' : 'Professor'}</th>
              </tr>
            </thead>
            <tbody>
              {transacoesFiltradas.map((t) => (
                <tr key={t.id}>
                  <td>{new Date(t.data).toLocaleString('pt-BR')}</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {tipoIcon(t.tipo)} {tipoLabel(t.tipo)}
                  </td>
                  <td>
                    <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CircleDollarSign size={14} /> {t.valor}
                    </span>
                  </td>
                  <td>
                    {t.motivo || '—'}
                    {t.tipo === 'RESGATE' && user?.role === 'ALUNO' && (
                      <div style={{ marginTop: '4px' }}>
                        <Link to="/meus-cupons" className="btn btn-sm btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', padding: '0.1rem 0.4rem' }}>
                          <Ticket size={12} /> Ver Cupom
                        </Link>
                      </div>
                    )}
                  </td>
                  <td>{user?.role === 'PROFESSOR' ? (t.alunoNome || '—') : (t.professorNome || t.vantagemDescricao || '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
