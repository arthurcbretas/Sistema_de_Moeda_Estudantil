import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { alunoApi, extratoApi } from '../../services/api';
import { GraduationCap, CircleDollarSign, ScrollText, Ticket, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function DashboardAluno() {
  const { user } = useAuth();
  const [aluno, setAluno] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      alunoApi.buscar(user.userId).catch(() => null),
      extratoApi.consultar().catch(() => ({ data: [] })),
    ]).then(([alunoRes, extratoRes]) => {
      if (alunoRes) setAluno(alunoRes.data);
      setTransacoes(extratoRes.data?.slice(0, 5) || []);
    }).finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) return <div className="main-content"><div className="loading-container"><div className="spinner"></div></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><GraduationCap size={32} /></span>Olá, {user.nome}!</h1>
        <p className="subtitle">Painel do Aluno</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <CircleDollarSign size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-gold)', margin: 'var(--space-sm) 0' }}>{aluno?.saldoMoedas ?? 0}</p>
          <p className="subtitle">Saldo de Moedas</p>
        </div>
        <Link to="/vantagens" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <Ticket size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--space-sm) 0' }}>Vantagens</p>
          <p className="subtitle">Resgate vantagens</p>
        </Link>
        <Link to="/meus-cupons" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <Ticket size={32} color="var(--success)" />
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--space-sm) 0' }}>Meus Cupons</p>
          <p className="subtitle">Ver códigos resgatados</p>
        </Link>
        <Link to="/extrato" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <ScrollText size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--space-sm) 0' }}>Extrato</p>
          <p className="subtitle">Ver histórico</p>
        </Link>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Últimas Transações</h3>
        {transacoes.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>Nenhuma transação recente.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>Data</th><th>Tipo</th><th>Valor</th><th>Motivo</th></tr></thead>
              <tbody>
                {transacoes.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.data).toLocaleString('pt-BR')}</td>
                    <td style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {t.tipo === 'RECEBIMENTO' ? <ArrowDownLeft size={14} color="var(--success)" /> : <ArrowUpRight size={14} color="var(--error)" />}
                      {t.tipo === 'RECEBIMENTO' ? 'Recebimento' : t.tipo === 'RESGATE' ? 'Resgate' : t.tipo}
                    </td>
                    <td><span className="badge badge-gold"><CircleDollarSign size={12} /> {t.valor}</span></td>
                    <td>{t.motivo || t.vantagemDescricao || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
