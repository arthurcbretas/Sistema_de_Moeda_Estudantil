import { CircleDollarSign } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <CircleDollarSign size={16} className="text-amber-500" /> Sistema de Moeda Estudantil &copy; {new Date().getFullYear()} — PUC Minas | 
        Laboratório de Desenvolvimento de Software
      </p>
    </footer>
  );
}
