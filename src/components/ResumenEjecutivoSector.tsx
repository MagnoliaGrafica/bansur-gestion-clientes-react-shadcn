import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsersIcon } from "@heroicons/react/24/outline";

// Define el tipo adecuado para los sectores
type SectorData = {
  monto: number;
  clientes: number;
};

type EjecutivosData = {
  [sectorId: string]: SectorData | number; // Sectores dinámicos + números (totalMonto y totalClientes)
  totalMonto: number;
  totalClientes: number;
};

export function ResumenEjecutivoSector() {
  const [resumenEjecutivoSector, setResumenEjecutivoSector] = useState<{
    fecha: string;
    totalesPorSector: { [sectorId: string]: { monto: number; clientes: number } };
    ejecutivos: { [key: string]: any };
  } | null>(null);

  const fetchResumenEjecutivoSector = async () => {
    try {
      const response = await axios.get(`https://bansur-api-express.vercel.app/api/resumen/ejecutivo_sector`);
      console.log("Datos recibidos:", response.data);
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

  const { totalesPorSector, ejecutivos: ejecutivosData } = resumenEjecutivoSector;

  // Calcular totales generales por sector
  const totalSector1Monto = totalesPorSector["1"]?.monto || 0;
  const totalSector2Monto = totalesPorSector["2"]?.monto || 0;
  const totalGeneralMonto = totalSector1Monto + totalSector2Monto;

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
        {Object.entries(ejecutivosData).map(([key, sectores], index) => {
          const sector1 = sectores["1"] || { monto: 0, clientes: 0 };
          const sector2 = sectores["2"] || { monto: 0, clientes: 0 };

          return (
            <TableRow key={index}>
              {/* Nombre del ejecutivo */}
              <TableCell>{ejecutivoMap.get(key) || `Desconocido (${key})`}</TableCell>
              {/* Sector Público */}
              <TableCell>
                <div className="text-center">
                  <UsersIcon className="inline size-4 text-bansur" /> {sector1.clientes}
                </div>
                <br />
                ${new Intl.NumberFormat("es-CL").format(sector1.monto)}
              </TableCell>
              {/* Sector Privado */}
              <TableCell>
                <div className="text-center">
                  <UsersIcon className="inline size-4 text-bansur" /> {sector2.clientes}
                </div>
                <br />
                ${new Intl.NumberFormat("es-CL").format(sector2.monto)}
              </TableCell>
              {/* Total */}
              <TableCell>
                <div className="text-center">
                  <UsersIcon className="inline size-4 text-bansur" /> {sectores.totalClientes || 0}
                </div>
                <br />
                ${new Intl.NumberFormat("es-CL").format(sectores.totalMonto || 0)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total General</TableCell>
          <TableCell>
            <div className="text-center">
              <UsersIcon className="inline size-4 text-bansur" /> {totalesPorSector["1"]?.clientes || 0}
            </div>
            <br />
            ${new Intl.NumberFormat("es-CL").format(totalSector1Monto)}
          </TableCell>
          <TableCell>
            <div className="text-center">
              <UsersIcon className="inline size-4 text-bansur" /> {totalesPorSector["2"]?.clientes || 0}
            </div>
            <br />
            ${new Intl.NumberFormat("es-CL").format(totalSector2Monto)}
          </TableCell>
          <TableCell>
            <div className="text-center">
              <UsersIcon className="inline size-4 text-bansur" />
            </div>
            <br />
            ${new Intl.NumberFormat("es-CL").format(totalGeneralMonto)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
