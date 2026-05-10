import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vantagemApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { resgateApi } from '../../services/api';
import { Ticket, Plus, CircleDollarSign, ShoppingCart } from 'lucide-react';

export default function VantagemList() {
  const { user } = useAuth();
  const [vantagens, setVantagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const empresaId = user?.role === 'EMPRESA' ? user.userId : undefined;
    vantagemApi.listar(empresaId)
      .then((res) => setVantagens(res.data))
      .catch(() => showToast('Erro ao carregar vantagens', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleResgate = async (vantagemId) => {
    if (!window.confirm('Confirma o resgate desta vantagem?')) return;
    try {
      const res = await resgateApi.resgatar({ vantagemId });
      showToast(`Resgate realizado! Cupom: ${res.data.codigo}`, 'success');
    } catch (err) {
      showToast(err.message || 'Erro ao resgatar', 'error');
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  if (loading) return <div className="main-content"><div className="loading-container"><div className="spinner"></div></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><Ticket size={32} /></span>Vantagens</h1>
        <p className="subtitle">Confira as vantagens oferecidas pelas empresas parceiras</p>
      </div>
      {user?.role === 'EMPRESA' && (
        <div style={{ marginBottom: 'var(--space-lg)', display: 'flex', justifyContent: 'flex-end' }}>
          <Link to="/vantagens/nova" className="btn btn-primary"><Plus size={18} /> Nova Vantagem</Link>
        </div>
      )}
      {vantagens.length === 0 ? (
        <div className="empty-state">
          <div className="icon" style={{ display: 'flex', justifyContent: 'center' }}><Ticket size={48} /></div>
          <p>Nenhuma vantagem cadastrada ainda.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
          {vantagens.map((v) => (
            <div key={v.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              {v.fotoUrl && <img src={v.fotoUrl} alt={v.descricao} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }} />}
              <h4 style={{ marginBottom: 'var(--space-sm)' }}>{v.descricao}</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>Empresa: {v.empresaNome}</p>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-md)' }}>
                <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem' }}>
                  <CircleDollarSign size={16} /> {v.custoMoedas} moedas
                </span>
                {user?.role === 'ALUNO' && (
                  <button className="btn btn-primary btn-sm" onClick={() => handleResgate(v.id)}>
                    <ShoppingCart size={14} /> Resgatar
                  </button>
                )}
                {user?.role === 'EMPRESA' && (
                  <Link to={`/vantagens/editar/${v.id}`} className="btn btn-secondary btn-sm">Editar</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}
    </div>
  );
}
