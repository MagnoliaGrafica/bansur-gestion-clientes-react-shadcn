import { useState } from "react";
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Construye la URL con los parámetros
      const response = await axios.post('https://bansur-api-express.vercel.app/api/user/login', {
        email,
        password,
      });
  
      // Extraer datos de la respuesta
      const { id, nombre, apellido, email: userEmail, rol, token } = response.data;
  
      if (token) {
        const user = {
          id,
          nombre,
          apellido,
          email: userEmail, // Esto es el email del usuario
          rol,
          username: userEmail.split('@')[0], // Derivar username del email
        };
  
        login(user, token); // Guarda los datos en el contexto de autenticación
        navigate('/dashboard'); // Redirigir al dashboard
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      alert('Error al intentar iniciar sesión');
    }
  };
  

  return (
    <div className="flex flex-col gap-6 mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          {/*<CardDescription>
            Enter your email below to login to your account
          </CardDescription>*/}
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/*<a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>*/}
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>
            {/*<div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>*/}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;