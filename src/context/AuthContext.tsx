import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Tipos para los datos de usuario y el contexto
interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: number; // Identificador del rol del usuario
  username: string; // Agregamos username derivado
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  hasRole: (roles: number[]) => boolean; // Nueva función para verificar roles
}

// Crear el contexto con un valor inicial indefinido
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tipos para las props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

// Componente proveedor del contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para comprobar si el token es válido
  const isTokenValid = (token: string): boolean => {
    try {
      if (!token) return false; // Si no hay token, no es válido
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del JWT
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      return decoded.exp > currentTime; // Comprobar expiración
    } catch (e) {
      console.error('Token inválido o error al decodificar:', e);
      return false; // Token no válido
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Inicializar estado desde localStorage si hay un token
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && isTokenValid(storedToken)) {
      setUser(JSON.parse(storedUser || '{}'));
      setIsAuthenticated(true);
    } else {
      logout();
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Función para iniciar sesión
  const login = (userData: User, token: string) => {
    localStorage.setItem('authToken', token); // Guardamos el token en localStorage
    localStorage.setItem('user', JSON.stringify(userData)); // Guardamos los datos del usuario
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Función para verificar si el usuario tiene acceso basado en roles
  const hasRole = (roles: number[]): boolean => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto en otros componentes
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
