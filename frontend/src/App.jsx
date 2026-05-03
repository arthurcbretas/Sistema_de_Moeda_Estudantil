import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AlunoList from './pages/aluno/AlunoList';
import AlunoForm from './pages/aluno/AlunoForm';
import EmpresaList from './pages/empresa/EmpresaList';
import EmpresaForm from './pages/empresa/EmpresaForm';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alunos" element={<AlunoList />} />
          <Route path="/alunos/novo" element={<AlunoForm />} />
          <Route path="/alunos/editar/:id" element={<AlunoForm />} />
          <Route path="/empresas" element={<EmpresaList />} />
          <Route path="/empresas/nova" element={<EmpresaForm />} />
          <Route path="/empresas/editar/:id" element={<EmpresaForm />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
