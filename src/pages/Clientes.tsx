import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SearchComponent from "../components/Search";

const Clientes = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirige a login si no está autenticado
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Mientras se realiza la redirección, no renderiza nada
  }

  return (
    <div>
      <h2 className="text-2xl font-medium text-bansur my-4">Gestión Comercial Clientes</h2>
      <SearchComponent />
    </div>
  );
};

export default Clientes;
