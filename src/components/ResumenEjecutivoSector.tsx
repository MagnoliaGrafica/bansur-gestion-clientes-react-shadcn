import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ResumenEjecutivoSector() {
  const [resumenEjecutivoSector, setResumenEjecutivoSector] = useState(null);

  const fetchResumenEjecutivoSector = async () => {
    try {
      const response = await axios.get(`https://bansur-api-express.vercel.app/api/resumen/ejecutivo_sector`);
      setResumenEjecutivoSector(response.data);
    } catch (error) {
      console.error("Error al obtener el resumen", error);
    }
  };

  useEffect(() => {
    fetchResumenEjecutivoSector();
  }, []);

  if (!resumenEjecutivoSector) {
    return <p>Cargando...</p>;
  }

  const ejecutivos = [
    { nombre: "Macarena Calistro", key: "2" },
    { nombre: "Edward Saldaña", key: "3" },
    { nombre: "Felipe Santana", key: "4" },
    { nombre: "Jeanette Bastidas", key: "5" },
    { nombre: "Pamela Puntareli", key: "6" },
    { nombre: "Lilian Santana", key: "7" },
    { nombre: "Alex Ballota", key: "8" },
  ];

  const ejecutivoMap = new Map(ejecutivos.map(({ key, nombre }) => [key, nombre]));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ejecutivo</TableHead>
          <TableHead>Sector 1</TableHead>
          <TableHead>Sector 2</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Clientes Sector 1</TableHead>
          <TableHead>Clientes Sector 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(resumenEjecutivoSector)
          .filter(([key]) => key !== "fecha") // Ignorar la clave "fecha"
          .map(([key, sectores], index) => {
            const sectoresData = sectores as { [sectorId: string]: { monto: number; clientes: number } }; // Type assertion
            const sector1 = sectoresData["1"] || { monto: 0, clientes: 0 };
            const sector2 = sectoresData["2"] || { monto: 0, clientes: 0 };
            const total = sector1.monto + sector2.monto;

            return (
                <TableRow key={index}>
                <TableCell>{ejecutivoMap.get(key) || `Desconocido (${key})`}</TableCell>
                <TableCell>${new Intl.NumberFormat("es-CL").format(sector1.monto)}</TableCell>
                <TableCell>${new Intl.NumberFormat("es-CL").format(sector2.monto)}</TableCell>
                <TableCell>${new Intl.NumberFormat("es-CL").format(total)}</TableCell>
                <TableCell>{sector1.clientes}</TableCell>
                <TableCell>{sector2.clientes}</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
