import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Tipos para los datos de usuario y el contexto
interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: number;
  username: string; // Agregamos username derivado
}


interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
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

  // Función para comprobar si el token es válido
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificamos el token JWT
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      return decoded.exp > currentTime; // Comprobamos si el token está expirado
    } catch (e) {
      return false;
    }
  };

  // Inicializar estado desde localStorage si hay un token
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && isTokenValid(storedToken)) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser || '{}')); // Recuperamos el usuario desde el localStorage
    } else {
      logout(); // Si el token no es válido o ha expirado
    }
  }, []);

  // Función para iniciar sesión
  const login = (userData: User, token: string) => {
    localStorage.setItem('authToken', token); // Guardamos el token en localStorage
    localStorage.setItem('user', JSON.stringify(userData)); // Guardamos los datos del usuario
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
