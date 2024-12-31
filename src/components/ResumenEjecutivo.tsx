import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ResumenEjecutivo } from "../types/Types"; // Importar como solo tipo
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ResumenEjecutivo() {
  const [resumenEjecutivo, setResumenEjecutivo] = useState<ResumenEjecutivo | null>(null);

  // Fetch de los datos
  const fetchResumen = async () => {
    try {
      const response = await axios.get<ResumenEjecutivo>(
        `https://bansur-api-express.vercel.app/api/resumen/ejecutivo`
      );
      setResumenEjecutivo(response.data);
    } catch (error) {
      console.error("Error al obtener el resumen", error);
    }
  };

  useEffect(() => {
    fetchResumen();
  }, []);

  // Si los datos aún no han sido cargados
  if (!resumenEjecutivo) {
    return <p>Cargando...</p>;
  }

  // Definir los ejecutivos y su key correspondiente
  const ejecutivos = [
    { nombre: "Macarena Calistro", key: "2" },
    { nombre: "Edward Saldaña", key: "3" },
    { nombre: "Felipe Santana", key: "4" },
    { nombre: "Jeanette Bastidas", key: "5" },
    { nombre: "Pamela Puntareli", key: "6" },
    { nombre: "Lilian Santana", key: "7" },
    { nombre: "Alex Ballota", key: "8" },
    { nombre: "Pedro Salinas", key: "9" },
  ];

  // Crear un mapa de claves para nombres de ejecutivos
  const ejecutivoMap = new Map(ejecutivos.map(({ key, nombre }) => [key, nombre]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ejecutivo</TableHead>
          <TableHead>Monto Cursado</TableHead>
          <TableHead>Cuenta de RUT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(resumenEjecutivo.totalesPorEjecutivo).map(([key, { monto, clientes }], index) => (
          <TableRow key={index}>
            <TableCell>{ejecutivoMap.get(key) || `Desconocido (${key})`}</TableCell>
            <TableCell>${new Intl.NumberFormat("es-CL").format(monto || 0)}</TableCell>
            <TableCell>{clientes || 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>${new Intl.NumberFormat("es-CL").format(resumenEjecutivo.sumaTotal || 0)}</TableCell>
          <TableCell>{resumenEjecutivo.clientes || 0}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
