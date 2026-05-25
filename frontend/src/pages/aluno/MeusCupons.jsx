import { useEffect, useState } from 'react';
import { resgateApi } from '../../services/api';
import { Ticket, Copy, CheckCircle } from 'lucide-react';
import './MeusCupons.css'; // Let's use a specific css or index.css

export default function MeusCupons() {
  const [cupons, setCupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    resgateApi.meusCupons()
      .then((res) => {
        setCupons(res.data || []);
      })
      .catch((err) => {
        console.error('Erro ao buscar cupons:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (id, codigo) => {
    navigator.clipboard.writeText(codigo);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <div className="main-content"><div className="loading-container"><div className="spinner"></div></div></div>;

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><Ticket size={32} /></span>Meus Cupons</h1>
        <p className="subtitle">Seus códigos de resgate de vantagens</p>
      </div>

      {cupons.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
          <Ticket size={48} color="var(--text-muted)" style={{ margin: '0 auto var(--space-md)' }} />
          <h3>Nenhum cupom resgatado</h3>
          <p className="subtitle">Você ainda não resgatou nenhuma vantagem. Acesse a página de vantagens para usar suas moedas!</p>
        </div>
      ) : (
        <div className="cupons-grid">
          {cupons.map((cupom) => (
            <div key={cupom.id} className="cupom-card card">
              <div className="cupom-header">
                <h3>{cupom.vantagemDescricao}</h3>
                <span className={`badge cupom-status badge-${cupom.status.toLowerCase()}`}>
                  {cupom.status}
                </span>
              </div>
              <p className="subtitle cupom-empresa">{cupom.empresaNome}</p>
              
              <div className="cupom-code-container">
                <span className="cupom-code">{cupom.codigo}</span>
                <button 
                  className="btn btn-icon" 
                  onClick={() => handleCopy(cupom.id, cupom.codigo)}
                  title="Copiar código"
                >
                  {copiedId === cupom.id ? <CheckCircle size={20} color="var(--success)" /> : <Copy size={20} />}
                </button>
              </div>

              <div className="cupom-footer">
                <span className="cupom-data">Resgatado em: {new Date(cupom.dataCriacao).toLocaleDateString('pt-BR')}</span>
                <span className="cupom-valor badge badge-gold">{cupom.valorMoedas} moedas</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
