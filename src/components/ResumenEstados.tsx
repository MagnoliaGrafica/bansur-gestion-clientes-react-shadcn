import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ResumenEstados } from "../types/Types"; // Importar como solo tipo
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ResumenEstados() {
  const [resumenEstados, setResumenEstados] = useState<ResumenEstados | null>(null);

  // Fetch de los datos
  const fetchResumenEstados = async () => {
    try {
      const response = await axios.get<ResumenEstados>(`https://bansur-api-express.vercel.app/api/resumen/estados`); 
      setResumenEstados(response.data);
    } catch (error) {
      console.error("Error al obtener el resumen", error);
    }
  };

  useEffect(() => {
    fetchResumenEstados();
  }, []);

  // Si los datos aún no han sido cargados
  if (!resumenEstados) {
    return <p>Cargando...</p>;
  }

  // Definir los canales y su key correspondiente
  const estados = [
    { nombre: "Prospecto", key: "1" },
    { nombre: "En Comité", key: "2" },
    { nombre: "Para Curse", key: "3" },
    { nombre: "Rechazado", key: "4" },
    { nombre: "Sin Respuesta", key: "5" }
  ];

  const estadosMap = new Map(estados.map(({ key, nombre }) => [key, nombre]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Estado</TableHead>
          <TableHead>Monto Total</TableHead>
          <TableHead>Cuenta de RUT</TableHead>
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {Object.entries(resumenEstados.totalesPorEstado).map(([key, { monto, clientes }], index) => (
          <TableRow key={index}>
            <TableCell>{estadosMap.get(key) || `Desconocido (${key})`}</TableCell>
            <TableCell>${new Intl.NumberFormat("es-CL").format(monto || 0)}</TableCell>
            <TableCell>{clientes || 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>${new Intl.NumberFormat("es-CL").format(resumenEstados.sumaTotal || 0)}</TableCell>
          <TableCell>{resumenEstados.totalClientes || 0}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
