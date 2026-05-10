import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import AlunoList from './pages/aluno/AlunoList';
import AlunoForm from './pages/aluno/AlunoForm';
import EmpresaList from './pages/empresa/EmpresaList';
import EmpresaForm from './pages/empresa/EmpresaForm';
import ProfessorList from './pages/professor/ProfessorList';
import ProfessorForm from './pages/professor/ProfessorForm';
import EnvioMoedas from './pages/professor/EnvioMoedas';
import VantagemList from './pages/vantagem/VantagemList';
import VantagemForm from './pages/vantagem/VantagemForm';
import InstituicaoList from './pages/instituicao/InstituicaoList';
import InstituicaoForm from './pages/instituicao/InstituicaoForm';
import Extrato from './pages/extrato/Extrato';
import DashboardAluno from './pages/dashboard/DashboardAluno';
import DashboardProfessor from './pages/dashboard/DashboardProfessor';
import DashboardEmpresa from './pages/dashboard/DashboardEmpresa';

function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
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
            {/* Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Dashboard - rota protegida */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardRouter /></ProtectedRoute>} />

            {/* Cadastro público (aluno e empresa) */}
            <Route path="/alunos/novo" element={<AlunoForm />} />
            <Route path="/empresas/nova" element={<EmpresaForm />} />

            {/* Alunos - protegido */}
            <Route path="/alunos" element={<ProtectedRoute><AlunoList /></ProtectedRoute>} />
            <Route path="/alunos/editar/:id" element={<ProtectedRoute><AlunoForm /></ProtectedRoute>} />

            {/* Empresas - protegido */}
            <Route path="/empresas" element={<ProtectedRoute><EmpresaList /></ProtectedRoute>} />
            <Route path="/empresas/editar/:id" element={<ProtectedRoute><EmpresaForm /></ProtectedRoute>} />

            {/* Professores - protegido */}
            <Route path="/professores" element={<ProtectedRoute><ProfessorList /></ProtectedRoute>} />
            <Route path="/professores/novo" element={<ProtectedRoute><ProfessorForm /></ProtectedRoute>} />
            <Route path="/professores/editar/:id" element={<ProtectedRoute><ProfessorForm /></ProtectedRoute>} />

            {/* Envio de moedas - professor */}
            <Route path="/moedas/enviar" element={<ProtectedRoute roles={['PROFESSOR']}><EnvioMoedas /></ProtectedRoute>} />

            {/* Vantagens */}
            <Route path="/vantagens" element={<VantagemList />} />
            <Route path="/vantagens/nova" element={<ProtectedRoute roles={['EMPRESA']}><VantagemForm /></ProtectedRoute>} />
            <Route path="/vantagens/editar/:id" element={<ProtectedRoute roles={['EMPRESA']}><VantagemForm /></ProtectedRoute>} />

            {/* Instituições */}
            <Route path="/instituicoes" element={<InstituicaoList />} />
            <Route path="/instituicoes/nova" element={<ProtectedRoute><InstituicaoForm /></ProtectedRoute>} />
            <Route path="/instituicoes/editar/:id" element={<ProtectedRoute><InstituicaoForm /></ProtectedRoute>} />

            {/* Extrato - protegido */}
            <Route path="/extrato" element={<ProtectedRoute roles={['ALUNO', 'PROFESSOR']}><Extrato /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
