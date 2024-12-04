import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ResumenCanal } from "../types/Types"; // Importar como solo tipo
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ResumenCanal() {
  const [resumenCanal, setResumenCanal] = useState<ResumenCanal | null>(null);

  // Fetch de los datos
  const fetchResumen = async () => {
    try {
      const response = await axios.get<ResumenCanal>(`https://bansur-api-express.vercel.app/api/resumen/canal`); 
      setResumenCanal(response.data);
    } catch (error) {
      console.error("Error al obtener el resumen", error);
    }
  };

  useEffect(() => {
    fetchResumen();
  }, []);

  // Si los datos aún no han sido cargados
  if (!resumenCanal) {
    return <p>Cargando...</p>;
  }

  // Definir los canales y su key correspondiente
  const canales = [
    { nombre: "Web", key: "1" },
    { nombre: "Teléfono", key: "2" },
    { nombre: "Mail", key: "3" },
    { nombre: "WhatsApp", key: "4" },
    { nombre: "RRSS", key: "5" },
    { nombre: "Ejecutivo", key: "6" },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Canal</TableHead>
          <TableHead>Monto Cursado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {canales.map((canal, index) => (
          <TableRow key={index}>
            <TableCell>{canal.nombre}</TableCell>
            <TableCell>${new Intl.NumberFormat("es-CL").format(resumenCanal.totalesPorCanal[canal.key] || 0)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>${new Intl.NumberFormat("es-CL").format(resumenCanal.sumaTotal || 0)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}