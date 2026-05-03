import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { alunoApi, empresaApi } from '../services/api';
import { UserPlus, Building, Users, Building2, CircleDollarSign, Ticket } from 'lucide-react';
import heroCoin from '../assets/hero-coin.png';

export default function Home() {
  const [stats, setStats] = useState({ alunos: 0, empresas: 0 });

  useEffect(() => {
    Promise.all([alunoApi.listar(), empresaApi.listar()])
      .then(([alunosRes, empresasRes]) => {
        setStats({
          alunos: alunosRes.data.length,
          empresas: empresasRes.data.length,
        });
      })
      .catch(() => {});
  }, []);

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
          <Link to="/alunos/novo" className="btn btn-primary" id="btn-novo-aluno-home">
            <UserPlus size={18} /> Cadastrar Aluno
          </Link>
          <Link to="/empresas/nova" className="btn btn-secondary" id="btn-nova-empresa-home">
            <Building size={18} /> Cadastrar Empresa
          </Link>
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Users size={36} color="var(--accent-gold)" /></div>
          <div className="stat-value">{stats.alunos}</div>
          <div className="stat-label">Alunos Cadastrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Building2 size={36} color="var(--accent-gold)" /></div>
          <div className="stat-value">{stats.empresas}</div>
          <div className="stat-label">Empresas Parceiras</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><CircleDollarSign size={36} color="var(--accent-gold)" /></div>
          <div className="stat-value">1.000</div>
          <div className="stat-label">Moedas / Semestre</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Ticket size={36} color="var(--accent-gold)" /></div>
          <div className="stat-value">∞</div>
          <div className="stat-label">Vantagens Disponíveis</div>
        </div>
      </div>
    </div>
  );
}
