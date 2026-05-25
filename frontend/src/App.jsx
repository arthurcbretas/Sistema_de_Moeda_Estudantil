import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboards por role
import DashboardAdmin from './pages/dashboard/DashboardAdmin';
import DashboardAluno from './pages/dashboard/DashboardAluno';
import DashboardProfessor from './pages/dashboard/DashboardProfessor';
import DashboardEmpresa from './pages/dashboard/DashboardEmpresa';

// CRUDs (admin)
import AlunoList from './pages/aluno/AlunoList';
import AlunoForm from './pages/aluno/AlunoForm';
import EmpresaList from './pages/empresa/EmpresaList';
import EmpresaForm from './pages/empresa/EmpresaForm';
import ProfessorList from './pages/professor/ProfessorList';
import ProfessorForm from './pages/professor/ProfessorForm';
import InstituicaoList from './pages/instituicao/InstituicaoList';
import InstituicaoForm from './pages/instituicao/InstituicaoForm';

// Funcionalidades
import EnvioMoedas from './pages/professor/EnvioMoedas';
import VantagemList from './pages/vantagem/VantagemList';
import VantagemForm from './pages/vantagem/VantagemForm';
import Extrato from './pages/extrato/Extrato';
import MeusCupons from './pages/aluno/MeusCupons';

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'ADMIN': return <DashboardAdmin />;
    case 'ALUNO': return <DashboardAluno />;
    case 'PROFESSOR': return <DashboardProfessor />;
    case 'EMPRESA': return <DashboardEmpresa />;
    default: return <Navigate to="/" replace />;
  }
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <Routes>
            {/* ═══ Públicas ═══ */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<Register />} />
            <Route path="/registrar/aluno" element={<AlunoForm />} />
            <Route path="/registrar/empresa" element={<EmpresaForm />} />
            <Route path="/vantagens" element={<VantagemList />} />

            {/* ═══ Dashboard (qualquer logado) ═══ */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />

            {/* ═══ ADMIN: CRUDs completos ═══ */}
            <Route path="/admin/alunos" element={<ProtectedRoute roles={['ADMIN']}><AlunoList /></ProtectedRoute>} />
            <Route path="/admin/alunos/novo" element={<ProtectedRoute roles={['ADMIN']}><AlunoForm /></ProtectedRoute>} />
            <Route path="/admin/alunos/editar/:id" element={<ProtectedRoute roles={['ADMIN']}><AlunoForm /></ProtectedRoute>} />

            <Route path="/admin/professores" element={<ProtectedRoute roles={['ADMIN']}><ProfessorList /></ProtectedRoute>} />
            <Route path="/admin/professores/novo" element={<ProtectedRoute roles={['ADMIN']}><ProfessorForm /></ProtectedRoute>} />
            <Route path="/admin/professores/editar/:id" element={<ProtectedRoute roles={['ADMIN']}><ProfessorForm /></ProtectedRoute>} />

            <Route path="/admin/empresas" element={<ProtectedRoute roles={['ADMIN']}><EmpresaList /></ProtectedRoute>} />
            <Route path="/admin/empresas/nova" element={<ProtectedRoute roles={['ADMIN']}><EmpresaForm /></ProtectedRoute>} />
            <Route path="/admin/empresas/editar/:id" element={<ProtectedRoute roles={['ADMIN']}><EmpresaForm /></ProtectedRoute>} />

            <Route path="/admin/instituicoes" element={<ProtectedRoute roles={['ADMIN']}><InstituicaoList /></ProtectedRoute>} />
            <Route path="/admin/instituicoes/nova" element={<ProtectedRoute roles={['ADMIN']}><InstituicaoForm /></ProtectedRoute>} />
            <Route path="/admin/instituicoes/editar/:id" element={<ProtectedRoute roles={['ADMIN']}><InstituicaoForm /></ProtectedRoute>} />

            {/* ═══ PROFESSOR: Envio de moedas ═══ */}
            <Route path="/moedas/enviar" element={<ProtectedRoute roles={['PROFESSOR']}><EnvioMoedas /></ProtectedRoute>} />

            {/* ═══ EMPRESA: Gerenciar vantagens ═══ */}
            <Route path="/vantagens/nova" element={<ProtectedRoute roles={['EMPRESA']}><VantagemForm /></ProtectedRoute>} />
            <Route path="/vantagens/editar/:id" element={<ProtectedRoute roles={['EMPRESA']}><VantagemForm /></ProtectedRoute>} />

            {/* ═══ Extrato (Aluno + Professor) ═══ */}
            <Route path="/extrato" element={<ProtectedRoute roles={['ALUNO', 'PROFESSOR']}><Extrato /></ProtectedRoute>} />

            {/* ═══ Aluno: Meus Cupons ═══ */}
            <Route path="/meus-cupons" element={<ProtectedRoute roles={['ALUNO']}><MeusCupons /></ProtectedRoute>} />

            {/* ═══ Fallback ═══ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
