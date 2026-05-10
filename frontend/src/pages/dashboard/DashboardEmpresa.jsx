import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { vantagemApi } from '../../services/api';
import { Briefcase, Ticket, Plus, CircleDollarSign } from 'lucide-react';

export default function DashboardEmpresa() {
  const { user } = useAuth();
  const [vantagens, setVantagens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vantagemApi.listar(user.userId)
      .then((res) => setVantagens(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user.userId]);

  if (loading) return <div className="main-content"><div className="loading-container"><div className="spinner"></div></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><Briefcase size={32} /></span>Olá, {user.nome}!</h1>
        <p className="subtitle">Painel da Empresa Parceira</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Ticket size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-gold)', margin: 'var(--space-sm) 0' }}>{vantagens.length}</p>
          <p className="subtitle">Vantagens Cadastradas</p>
        </div>
        <Link to="/vantagens/nova" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <Plus size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--space-sm) 0' }}>Nova Vantagem</p>
          <p className="subtitle">Cadastrar vantagem</p>
        </Link>
        <Link to="/vantagens" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <Ticket size={32} color="var(--accent-gold)" />
          <p style={{ fontSize: '1.2rem', fontWeight: 600, margin: 'var(--space-sm) 0' }}>Minhas Vantagens</p>
          <p className="subtitle">Gerenciar vantagens</p>
        </Link>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 'var(--space-md)' }}>Vantagens Ativas</h3>
        {vantagens.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>Nenhuma vantagem cadastrada.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--space-md)' }}>
            {vantagens.map((v) => (
              <div key={v.id} style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4>{v.descricao}</h4>
                <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-sm)' }}>
                  <CircleDollarSign size={14} /> {v.custoMoedas} moedas
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
