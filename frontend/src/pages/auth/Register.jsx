import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, GraduationCap, Building2 } from 'lucide-react';

export default function Register() {
  return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <UserPlus size={48} color="var(--accent-gold)" />
          <h2 style={{ marginTop: 'var(--space-md)' }}>Criar Conta</h2>
          <p className="subtitle">Selecione o tipo de conta que deseja criar</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
          <Link to="/registrar/aluno" className="card" style={{ textAlign: 'center', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} id="btn-register-aluno">
            <GraduationCap size={48} color="var(--accent-gold)" />
            <h3 style={{ margin: 'var(--space-md) 0 var(--space-sm)' }}>Sou Aluno</h3>
            <p className="subtitle" style={{ fontSize: '0.85rem' }}>
              Cadastre-se para receber moedas e trocar por vantagens
            </p>
          </Link>

          <Link to="/registrar/empresa" className="card" style={{ textAlign: 'center', textDecoration: 'none', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} id="btn-register-empresa">
            <Building2 size={48} color="var(--accent-gold)" />
            <h3 style={{ margin: 'var(--space-md) 0 var(--space-sm)' }}>Sou Empresa</h3>
            <p className="subtitle" style={{ fontSize: '0.85rem' }}>
              Cadastre sua empresa para oferecer vantagens aos alunos
            </p>
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <p className="subtitle">
            Já possui uma conta? <Link to="/login" style={{ color: 'var(--accent-gold)', textDecoration: 'underline' }}>Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
