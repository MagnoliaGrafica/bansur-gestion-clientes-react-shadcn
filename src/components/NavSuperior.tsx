import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

const NavSuperior = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir al login después de cerrar sesión
  };

  return (
    <nav className="bg-bansur text-white p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-bold ml-24">Gestión Comercial</h1>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm">
              <strong>Usuario:</strong> {user.nombre} {user.apellido}
            </p>
            <p className="text-sm">
              <strong>Rol:</strong> {user.rol}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavSuperior;
