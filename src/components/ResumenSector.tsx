import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ResumenSector } from "../types/Types"; // Importar como solo tipo
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ResumenSector() {
  const [resumenSector, setResumenSector] = useState<ResumenSector | null>(null);

  // Fetch de los datos
  const fetchResumen = async () => {
    try {
      const response = await axios.get<ResumenSector>(`https://bansur-api-express.vercel.app/api/resumen/sector`); 
      setResumenSector(response.data);
    } catch (error) {
      console.error("Error al obtener el resumen", error);
    }
  };

  useEffect(() => {
    fetchResumen();
  }, []);

  // Si los datos aún no han sido cargados
  if (!resumenSector) {
    return <p>Cargando...</p>;
  }

  // Definir los canales y su key correspondiente
  const sectores = [
    { nombre: "Público", key: "1" },
    { nombre: "Privado", key: "2" }
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sector</TableHead>
          <TableHead>Monto Cursado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sectores.map((sector, index) => (
          <TableRow key={index}>
            <TableCell>{sector.nombre}</TableCell>
            <TableCell>${new Intl.NumberFormat("es-CL").format(resumenSector.totalesPorSector[sector.key] || 0)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>${new Intl.NumberFormat("es-CL").format(resumenSector.sumaTotal || 0)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
