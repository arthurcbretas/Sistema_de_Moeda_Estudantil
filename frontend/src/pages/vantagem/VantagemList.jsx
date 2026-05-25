import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vantagemApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { resgateApi, alunoApi } from '../../services/api';
import { Ticket, Plus, CircleDollarSign, ShoppingCart, AlertCircle } from 'lucide-react';

export default function VantagemList() {
  const { user } = useAuth();
  const [vantagens, setVantagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [alunoSaldo, setAlunoSaldo] = useState(null);
  const [modalResgate, setModalResgate] = useState(null);

  useEffect(() => {
    const empresaId = user?.role === 'EMPRESA' ? user.userId : undefined;
    
    const fetchPromises = [vantagemApi.listar(empresaId)];
    if (user?.role === 'ALUNO') {
      fetchPromises.push(alunoApi.buscar(user.userId).catch(() => null));
    }

    Promise.all(fetchPromises)
      .then(([vantagensRes, alunoRes]) => {
        setVantagens(vantagensRes.data);
        if (alunoRes) setAlunoSaldo(alunoRes.data?.saldoMoedas);
      })
      .catch(() => showToast('Erro ao carregar dados', 'error'))
      .finally(() => setLoading(false));
  }, [user]);

  const confirmarResgate = (vantagem) => {
    setModalResgate(vantagem);
  };

  const handleResgate = async () => {
    if (!modalResgate) return;
    try {
      const res = await resgateApi.resgatar({ vantagemId: modalResgate.id });
      showToast(`Resgate realizado! Cupom: ${res.data.codigo}`, 'success');
      setModalResgate(null);
      // Atualizar saldo
      if (alunoSaldo !== null) {
        setAlunoSaldo(alunoSaldo - modalResgate.custoMoedas);
      }
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <div>
          <h1><span className="icon" style={{ display: 'flex' }}><Ticket size={32} /></span>Vantagens</h1>
          <p className="subtitle">Confira as vantagens oferecidas pelas empresas parceiras</p>
        </div>
        {user?.role === 'ALUNO' && alunoSaldo !== null && (
          <div className="card" style={{ padding: 'var(--space-sm) var(--space-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', margin: 0 }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seu saldo:</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CircleDollarSign size={20} /> {alunoSaldo}
            </span>
          </div>
        )}
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
                  <button 
                    className="btn btn-primary btn-sm" 
                    onClick={() => confirmarResgate(v)}
                    disabled={alunoSaldo !== null && alunoSaldo < v.custoMoedas}
                  >
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

      {/* Modal de Confirmação */}
      {modalResgate && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '400px', width: '90%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', color: 'var(--accent-gold)', marginBottom: 'var(--space-md)' }}>
              <AlertCircle size={24} />
              <h3 style={{ margin: 0 }}>Confirmar Resgate</h3>
            </div>
            <p style={{ marginBottom: 'var(--space-sm)' }}>
              Deseja realmente resgatar a vantagem <strong>{modalResgate.descricao}</strong>?
            </p>
            <p style={{ marginBottom: 'var(--space-xl)', color: 'var(--text-muted)' }}>
              O custo de <strong>{modalResgate.custoMoedas} moedas</strong> será debitado do seu saldo.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-md)' }}>
              <button className="btn btn-secondary" onClick={() => setModalResgate(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleResgate}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
