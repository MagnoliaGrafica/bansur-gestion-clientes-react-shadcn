import { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UsersIcon } from "@heroicons/react/24/outline";

export function ResumenEjecutivoSector() {
  const [resumenEjecutivoSector, setResumenEjecutivoSector] = useState(null);

  // Función para obtener los datos de la API
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

  // Datos de los ejecutivos, puedes obtener esto de la API si es necesario
  const ejecutivos = [
    { nombre: "Macarena Calistro", key: "2" },
    { nombre: "Edward Saldaña", key: "3" },
    { nombre: "Felipe Santana", key: "4" },
    { nombre: "Jeanette Bastidas", key: "5" },
    { nombre: "Pamela Puntareli", key: "6" },
    { nombre: "Lilian Santana", key: "7" },
    { nombre: "Alex Ballota", key: "8" },
  ];

  // Mapa de ejecutivos por key
  const ejecutivoMap = new Map(ejecutivos.map(({ key, nombre }) => [key, nombre]));
  const { ejecutivos: ejecutivosData } = resumenEjecutivoSector;

  // Calcular los totales
  let totalSector1Monto = 0;
  let totalSector2Monto = 0;
  let totalGeneralMonto = 0;

  Object.values(ejecutivosData).forEach((sectores) => {
    const sector1 = sectores["1"] || { monto: 0, clientes: 0 }; // Asegúrate que sector1 existe
    const sector2 = sectores["2"] || { monto: 0, clientes: 0 }; // Asegúrate que sector2 existe
    totalSector1Monto += sector1.monto;
    totalSector2Monto += sector2.monto;
    totalGeneralMonto += sectores.totalMonto;
  });

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
        {/* Renderizar los datos de los ejecutivos */}
        {Object.entries(ejecutivosData).map(([key, sectores], index) => {
          // Asegúrate de que los sectores tienen los valores correctos
          const sectoresData = sectores as {
            [sectorId: string]: { monto: number; clientes: number };
            totalMonto: number;
            totalClientes: number;
          };

          const sector1 = sectoresData["1"] || { monto: 0, clientes: 0 }; // Valores predeterminados
          const sector2 = sectoresData["2"] || { monto: 0, clientes: 0 }; // Valores predeterminados

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
                  <UsersIcon className="inline size-4 text-bansur" /> {sectoresData.totalClientes}
                </div>
                <br />
                ${new Intl.NumberFormat("es-CL").format(sectoresData.totalMonto)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
      <TableFooter>
        {/* Mostrar los totales */}
        <TableRow>
          <TableCell>Total General</TableCell>
          <TableCell>
            <div className="text-center">
              <UsersIcon className="inline size-4 text-bansur" />
            </div>
            <br />
            ${new Intl.NumberFormat("es-CL").format(totalSector1Monto)}
          </TableCell>
          <TableCell>
            <div className="text-center">
              <UsersIcon className="inline size-4 text-bansur" />
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
