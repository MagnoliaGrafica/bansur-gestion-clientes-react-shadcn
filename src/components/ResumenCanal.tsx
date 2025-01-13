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
    { nombre: "Ejecutivo", key: "1" },
    { nombre: "Bansur", key: "2" }
  ];

  // Crear un mapa de claves para nombres de ejecutivos
  const canalMap = new Map(canales.map(({ key, nombre }) => [key, nombre]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Canal</TableHead>
          <TableHead>Monto Total</TableHead>
          <TableHead>Cuenta de RUT</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(resumenCanal.totalesPorCanal).map(([key, { monto, clientes }], index) => (
          <TableRow key={index}>
            <TableCell>{canalMap.get(key) || `Desconocido (${key})`}</TableCell>
            <TableCell>${new Intl.NumberFormat("es-CL").format(monto || 0)}</TableCell>
            <TableCell>{clientes || 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>${new Intl.NumberFormat("es-CL").format(resumenCanal.sumaTotal || 0)}</TableCell>
          <TableCell>{resumenCanal.totalClientes || 0}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
