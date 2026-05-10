import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CircleDollarSign, Home, GraduationCap, Building2, Users, Ticket, ScrollText, Send, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <Link to="/" className="navbar-brand">
        <CircleDollarSign size={24} className="coin-icon" />
        <span>Moeda Estudantil</span>
      </Link>
      <ul className="navbar-nav">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <Home size={18} /> Home
          </Link>
        </li>

        {user && (
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          </li>
        )}

        {/* Menu para ALUNO */}
        {user?.role === 'ALUNO' && (
          <>
            <li><Link to="/vantagens" className={isActive('/vantagens')}><Ticket size={18} /> Vantagens</Link></li>
            <li><Link to="/extrato" className={isActive('/extrato')}><ScrollText size={18} /> Extrato</Link></li>
          </>
        )}

        {/* Menu para PROFESSOR */}
        {user?.role === 'PROFESSOR' && (
          <>
            <li><Link to="/moedas/enviar" className={isActive('/moedas')}><Send size={18} /> Enviar Moedas</Link></li>
            <li><Link to="/alunos" className={isActive('/alunos')}><GraduationCap size={18} /> Alunos</Link></li>
            <li><Link to="/extrato" className={isActive('/extrato')}><ScrollText size={18} /> Extrato</Link></li>
          </>
        )}

        {/* Menu para EMPRESA */}
        {user?.role === 'EMPRESA' && (
          <>
            <li><Link to="/vantagens" className={isActive('/vantagens')}><Ticket size={18} /> Vantagens</Link></li>
          </>
        )}

        {/* Menu admin - visível para qualquer logado (simplificação) */}
        {user && (
          <>
            <li><Link to="/professores" className={isActive('/professores')}><Users size={18} /> Professores</Link></li>
            <li><Link to="/empresas" className={isActive('/empresas')}><Building2 size={18} /> Empresas</Link></li>
            <li><Link to="/instituicoes" className={isActive('/instituicoes')}><Building2 size={18} /> Instituições</Link></li>
          </>
        )}

        {/* Não logado - links de cadastro público */}
        {!user && (
          <>
            <li><Link to="/alunos/novo" className={isActive('/alunos')}><GraduationCap size={18} /> Cadastrar Aluno</Link></li>
            <li><Link to="/empresas/nova" className={isActive('/empresas')}><Building2 size={18} /> Cadastrar Empresa</Link></li>
            <li><Link to="/vantagens" className={isActive('/vantagens')}><Ticket size={18} /> Vantagens</Link></li>
          </>
        )}

        {/* Auth */}
        {user ? (
          <li>
            <button onClick={handleLogout} className="nav-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit', font: 'inherit', padding: '0.5rem 0.75rem' }}>
              <LogOut size={18} /> Sair
            </button>
          </li>
        ) : (
          <li><Link to="/login" className={isActive('/login')}><LogIn size={18} /> Entrar</Link></li>
        )}

        <li style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
