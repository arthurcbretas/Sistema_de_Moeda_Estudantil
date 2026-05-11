import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, GraduationCap, Users, Building2, Landmark } from 'lucide-react';

export default function DashboardAdmin() {
  const { user } = useAuth();

  return (
    <div className="main-content">
      <div className="page-header">
        <h1><span className="icon" style={{ display: 'flex' }}><Shield size={32} /></span>Painel Administrativo</h1>
        <p className="subtitle">Gerencie todos os registros do sistema</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-lg)' }}>
        <Link to="/admin/alunos" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <GraduationCap size={40} color="var(--accent-gold)" />
          <h3 style={{ margin: 'var(--space-md) 0 var(--space-sm)' }}>Alunos</h3>
          <p className="subtitle">Gerenciar cadastros de alunos</p>
        </Link>

        <Link to="/admin/professores" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <Users size={40} color="var(--accent-gold)" />
          <h3 style={{ margin: 'var(--space-md) 0 var(--space-sm)' }}>Professores</h3>
          <p className="subtitle">Gerenciar cadastros de professores</p>
        </Link>

        <Link to="/admin/empresas" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <Building2 size={40} color="var(--accent-gold)" />
          <h3 style={{ margin: 'var(--space-md) 0 var(--space-sm)' }}>Empresas</h3>
          <p className="subtitle">Gerenciar empresas parceiras</p>
        </Link>

        <Link to="/admin/instituicoes" className="card" style={{ textAlign: 'center', textDecoration: 'none' }}>
          <Landmark size={40} color="var(--accent-gold)" />
          <h3 style={{ margin: 'var(--space-md) 0 var(--space-sm)' }}>Instituições</h3>
          <p className="subtitle">Gerenciar instituições de ensino</p>
        </Link>
      </div>
    </div>
  );
}
