import { Link, useLocation } from 'react-router-dom';
import { CircleDollarSign, Home, GraduationCap, Building2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path) ? 'active' : '';

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
        <li>
          <Link to="/alunos" className={isActive('/alunos')}>
            <GraduationCap size={18} /> Alunos
          </Link>
        </li>
        <li>
          <Link to="/empresas" className={isActive('/empresas')}>
            <Building2 size={18} /> Empresas
          </Link>
        </li>
        <li style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center' }}>
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}
