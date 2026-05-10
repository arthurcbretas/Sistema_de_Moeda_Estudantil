import { useEffect, useState } from 'react';
import { extratoApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { ScrollText, CircleDollarSign, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';

export default function Extrato() {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    extratoApi.consultar()
      .then((res) => setTransacoes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
              {transacoes.map((t) => (
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
                  <td>{t.motivo || '—'}</td>
                  <td>{user?.role === 'PROFESSOR' ? (t.alunoNome || '—') : (t.professorNome || '—')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
