import * as React from "react";
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

const Rechazados = () => {
    const { isAuthenticated, user, hasRole } = useAuth(); 
    const navigate = useNavigate();
    const [rechazados, setRechazados] = React.useState<any[]>([]);
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); 
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
      if(!user) return; // Si user es null, salir de la función

      let apiUrl = `https://bansur-api-express.vercel.app/api/clientes?estadoId=6`;

      if (hasRole([3, 4]) && user.id) {
          apiUrl += `&banUserId=${user.id}`;
      }

      fetch(apiUrl)
          .then((response) => {
              if (!response.ok) throw new Error("Error en la API");
              return response.json();
          })
          .then((data) => setRechazados(data))
          .catch((error) => setError(error.message));
  }
  , [user, hasRole]);
      
     

    if (!isAuthenticated) return null; // Evita renderizado si no está autenticado

    return (
        <div className="pl-28">
            <h2 className="text-2xl font-medium text-bansur my-4">Prospectos Rechazados</h2>

            {error && <p className="text-red-500">{error}</p>}

            <Table>
  <TableCaption>Lista de Prospectos Rechazados.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Nombre</TableHead>
      <TableHead>Razones</TableHead>
      <TableHead>Monto Evaluado</TableHead>
      <TableHead>Fecha Cierre</TableHead>
      <TableHead>Ejecutivo</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
  {rechazados.length === 0 && !error ? (
    <TableRow>
      <TableCell colSpan={6} className="text-center">Cargando...</TableCell>
    </TableRow>
  ) : (
    rechazados.map((item, index) => (
      <TableRow key={index}>
        <TableCell>{item.nombre} {item.apellido}</TableCell>
        <TableCell>{item.gc_tipo_rechazos?.nombre || "No especificado"}</TableCell>
        <TableCell>
          {new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(item.montoEvaluar || 0)}
        </TableCell>
        <TableCell>
          {item.fechaCierre 
            ? new Date(item.fechaCierre).toLocaleDateString("es-CL") 
            : "No disponible"}
        </TableCell>
        <TableCell>
          {item.gc_ban_user?.nombre || "No asignado"} {item.gc_ban_user?.apellido || ""}
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>


</Table>

        </div>
    );
};

export default Rechazados;
