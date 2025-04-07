import * as React from "react";
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from "sonner";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
  } from "@/components/ui/pagination";
  
  

const Cursados = () => {
    const { isAuthenticated, user, hasRole } = useAuth(); 
    const navigate = useNavigate();
    const [cursados, setCursados] = React.useState<any[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [mesSeleccionado, setMesSeleccionado] = React.useState("");

  const itemsPerPage = 10;

    useEffect(() => {
        if (!isAuthenticated ) {
            navigate('/login'); 
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
      if (!user) return; // Si user es null, salir de la función
  
      let apiUrl = `https://bansur-api-express.vercel.app/api/clientes?estadoId=7`;
  
      // Si el usuario tiene rol 3 o 4 y user.id está definido, agregarlo a la URL
      if (hasRole([3, 4]) && user.id) {
          apiUrl += `&banUserId=${user.id}`;
      }
  
      fetch(apiUrl)
          .then((response) => {
              if (!response.ok) throw new Error("Error en la API");
              return response.json();
          })
          .then((data) => setCursados(data))
          .catch(() => toast.error("Error al cargar los cursados"));
  }, [user, hasRole]);

  const cursadosFiltrados = mesSeleccionado
    ? cursados.filter((item) => {
        if (!item.fechaCierre) return false;
        const mes = new Date(item.fechaCierre).getMonth() + 1;
        return mes === parseInt(mesSeleccionado);
      })
    : cursados;

  if (!isAuthenticated) return null; // Evita renderizado si no está autenticado

  const totalPages = Math.ceil(cursadosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  
  const cursadosOrdenados = [...cursadosFiltrados].sort((a, b) => {
    const fechaA = new Date(a.fechaCierre).getTime();
    const fechaB = new Date(b.fechaCierre).getTime();
    return fechaB - fechaA; // Más recientes primero
  });
  
  const cursadosPaginados = cursadosOrdenados.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="pl-28">
            <h2 className="text-2xl font-medium text-bansur my-4">Prospectos Cursados</h2>

            {error && <p className="text-red-500">{error}</p>}

            {/* Filtro por mes */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Filtrar por mes:</label>
        <select
          value={mesSeleccionado}
          onChange={(e) => {
            setMesSeleccionado(e.target.value);
            setCurrentPage(1);
          }}
          className="border px-3 py-2 rounded w-60"
        >
          <option value="">Todos</option>
          {Array.from({ length: 12 }, (_, i) => {
            const fecha = new Date(0, i);
            const nombreMes = fecha.toLocaleString("es-CL", { month: "long" });
            return (
              <option key={i} value={i + 1}>
                {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}
              </option>
            );
          })}
        </select>
      </div>

            {/* Tabla */}
            <div className="rounded-md border">
      <Table>
      <TableCaption>Lista de Clientes con montos cursados.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Monto Evaluado</TableHead>
            <TableHead>Fecha de Cierre</TableHead>
            <TableHead>Ejecutivo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cursadosPaginados.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.nombre} {item.apellido}</TableCell>
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
          ))}
        </TableBody>
      </Table>
      </div>
       {/* Paginación */}
       <div className="mt-6">
       <Pagination>
  <PaginationContent>
    {Array.from({ length: totalPages }, (_, i) => {
      const isActive = currentPage === i + 1;

      return (
        <PaginationItem key={i}>
          <PaginationLink
            isActive={isActive}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-md border text-sm font-medium cursor-pointer transition-colors ${
              isActive
                ? "bg-bansur text-white hover:bg-bansur"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    })}
  </PaginationContent>
</Pagination>

      </div>

        </div>
    );
};

export default Cursados;
