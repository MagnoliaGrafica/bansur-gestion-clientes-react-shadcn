import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsersIcon } from "@heroicons/react/24/outline";

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
          <TableHead>Público</TableHead>
          <TableHead>Privado</TableHead>
          <TableHead>Total</TableHead>
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
                <TableCell><div className="text-center"><UsersIcon className="inline size-4 text-bansur" />{sector1.clientes}</div><br />${new Intl.NumberFormat("es-CL").format(sector1.monto)}</TableCell>
                <TableCell><div className="text-center"><UsersIcon className="inline size-4 text-bansur" />{sector2.clientes}</div><br />${new Intl.NumberFormat("es-CL").format(sector2.monto)}</TableCell>
                <TableCell>${new Intl.NumberFormat("es-CL").format(total)}</TableCell>
                
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  );
}
