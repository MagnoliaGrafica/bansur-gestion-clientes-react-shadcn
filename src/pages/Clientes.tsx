import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
//import SearchComponent from "../components/Search";
import ListarByEjecutivo from '@/components/ListarByEjecutivo';
import DemoPage from '@/components/lista-clientes/page.tsx';

const Clientes = () => {
  const { isAuthenticated, hasRole } = useAuth(); // Agregamos hasRole
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
      
      {/* Renderizar SearchComponent solo si el rol es 1 o 2 */}
      {/*hasRole([1, 2]) && <SearchComponent />*/}
      {hasRole([1, 2]) && <DemoPage />}

      {/* Renderizar ListarByEjecutivo solo si el rol es 4 */}
      {hasRole([4]) && <ListarByEjecutivo />}
    </div>
  );
};

export default Clientes;
