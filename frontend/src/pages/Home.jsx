import { Link } from 'react-router-dom';
import { UserPlus, LogIn, CircleDollarSign, Ticket, Users, Building2, LayoutDashboard, ScrollText, Send, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import heroCoin from '../assets/hero-coin.png';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="main-content">
      <section className="hero">
        <img src={heroCoin} alt="Moeda Estudantil" className="hero-coin-img" />
        <h1>Sistema de Moeda Estudantil</h1>
        <p>
          Plataforma de reconhecimento do mérito estudantil. Professores
          distribuem moedas, alunos trocam por vantagens em empresas parceiras.
        </p>
        <div className="hero-actions">
          {!user ? (
            <>
              <Link to="/registrar" className="btn btn-primary" id="btn-criar-conta-home">
                <UserPlus size={18} /> Criar Conta
              </Link>
              <Link to="/login" className="btn btn-secondary" id="btn-login-home">
                <LogIn size={18} /> Entrar
              </Link>
            </>
          ) : user.role === 'ADMIN' ? (
            <Link to="/dashboard" className="btn btn-primary">
              <LayoutDashboard size={18} /> Acessar Painel
            </Link>
          ) : user.role === 'ALUNO' ? (
            <>
              <Link to="/vantagens" className="btn btn-primary">
                <Ticket size={18} /> Ver Vantagens
              </Link>
              <Link to="/extrato" className="btn btn-secondary">
                <ScrollText size={18} /> Meu Extrato
              </Link>
            </>
          ) : user.role === 'PROFESSOR' ? (
            <>
              <Link to="/moedas/enviar" className="btn btn-primary">
                <Send size={18} /> Enviar Moedas
              </Link>
              <Link to="/extrato" className="btn btn-secondary">
                <ScrollText size={18} /> Meu Extrato
              </Link>
            </>
          ) : user.role === 'EMPRESA' ? (
            <>
              <Link to="/vantagens/nova" className="btn btn-primary">
                <Plus size={18} /> Nova Vantagem
              </Link>
              <Link to="/vantagens" className="btn btn-secondary">
                <Ticket size={18} /> Minhas Vantagens
              </Link>
            </>
          ) : null}
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={36} color="var(--accent-gold)" /></div>
          <div className="stat-value">Alunos</div>
          <div className="stat-label">Recebem moedas por mérito</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CircleDollarSign size={36} color="var(--accent-gold)" /></div>
          <div className="stat-value">1.000</div>
          <div className="stat-label">Moedas / Semestre</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Ticket size={36} color="var(--accent-gold)" /></div>
          <div className="stat-value">Vantagens</div>
          <div className="stat-label">Troque moedas por benefícios</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Building2 size={36} color="var(--accent-gold)" /></div>
          <div className="stat-value">Empresas</div>
          <div className="stat-label">Parceiras oferecem descontos</div>
        </div>
      </div>
    </div>
  );
}
