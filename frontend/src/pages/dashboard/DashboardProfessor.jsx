import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { professorApi, extratoApi } from '../../services/api';
import { Users, CircleDollarSign, Send, ScrollText, ArrowUpRight } from 'lucide-react';

export default function DashboardProfessor() {
  const { user } = useAuth();
  const [professor, setProfessor] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      professorApi.buscar(user.userId).catch(() => null),
      extratoApi.consultar().catch(() => ({ data: [] })),
    ]).then(([profRes, extratoRes]) => {
      if (profRes) setProfessor(profRes.data);
      setTransacoes(extratoRes.data?.slice(0, 5) || []);
    }).finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) return <div className="main-content"><div className="loading-container"><div className="spinner"></div></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><Users size={32} /></span>Olá, {user.nome}!</h1>
        <p className="subtitle">Painel do Professor</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <CircleDollarSign size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-gold)', margin: 'var(--space-sm) 0' }}>{professor?.saldoMoedas ?? 0}</p>
          <p className="subtitle">Saldo de Moedas</p>
        </div>
        <Link to="/moedas/enviar" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <Send size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--space-sm) 0' }}>Enviar Moedas</p>
          <p className="subtitle">Reconhecer um aluno</p>
        </Link>
        <Link to="/extrato" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <ScrollText size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--space-sm) 0' }}>Extrato</p>
          <p className="subtitle">Histórico de envios</p>
        </Link>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Últimos Envios</h3>
        {transacoes.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>Nenhum envio recente.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead><tr><th>Data</th><th>Aluno</th><th>Valor</th><th>Motivo</th></tr></thead>
              <tbody>
                {transacoes.map((t) => (
                  <tr key={t.id}>
                    <td>{new Date(t.data).toLocaleString('pt-BR')}</td>
                    <td>{t.alunoNome || '—'}</td>
                    <td><span className="badge badge-gold"><CircleDollarSign size={12} /> {t.valor}</span></td>
                    <td>{t.motivo || '—'}</td>
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
