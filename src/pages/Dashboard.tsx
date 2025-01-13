import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

import { ResumenCanal } from "@/components/ResumenCanal";
import { ResumenEstados } from "@/components/ResumenEstados";
import { ResumenEjecutivo } from "@/components/ResumenEjecutivo";

import ChartEjecutivo from "@/components/ChartEjecutivo.tsx";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useEffect } from 'react';

const Dashboard = () => {
  const { isAuthenticated, hasRole } = useAuth(); // Agregamos hasRole
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirige si no está autenticado
    } else if (!hasRole([1, 2])) {
      navigate('/clientes'); // Redirige si el rol no está permitido
    }
  }, [isAuthenticated, hasRole, navigate]);

  if (!isAuthenticated || !hasRole([1, 2])) {
    return null; // Evita renderizar mientras se realiza la redirección
  }

  return (
    <div>
      <h2 className="text-2xl font-medium text-bansur my-4">Dashboard Gestión Comercial</h2>
      <div className="grid grid-cols-3 gap-8">
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Resumen Ejecutivo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumenEjecutivo />
            </CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Resumen Canal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumenCanal />
            </CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Resumen Estados</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumenEstados />
            </CardContent>
          </Card>
        </section>
        <section>
          <ChartEjecutivo />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;