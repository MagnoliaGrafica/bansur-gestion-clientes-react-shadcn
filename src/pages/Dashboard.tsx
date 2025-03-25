import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';

import { ResumenCanal } from "@/components/ResumenCanal";
import { ResumenEstados } from "@/components/ResumenEstados";
import { ResumenEjecutivoCompleto } from "@/components/ResumenEjecutivoCompleto";

import ChartEjecutivo from "@/components/ChartEjecutivo.tsx";
import ChartEjecutivosDiarios from '@/components/ChartEjecutivoDiario.tsx';
import {MonthlyChart2} from '@/components/ChartDiario2.tsx'

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
    <div className='pl-28'>
      <h2 className="text-2xl font-medium text-bansur my-4">Dashboard Gestión Comercial</h2>
      <div className="grid grid-cols-3 gap-8">
         <section className='col-span-3'>
          <Card>
            <CardHeader>
              <CardTitle>Resumen Ejecutivo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResumenEjecutivoCompleto />
            </CardContent>
          </Card>
        </section>
        <section className='col-span-2'>
          <MonthlyChart2></MonthlyChart2>
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
        <section>
          <ChartEjecutivosDiarios />
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
        
      </div>
    </div>
  );
};

export default Dashboard;