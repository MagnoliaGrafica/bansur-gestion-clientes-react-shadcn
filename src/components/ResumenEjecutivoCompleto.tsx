import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ResumenEjecutivo } from "../types/Types";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ResumenEjecutivoCompleto() {
  const [resumenEjecutivo, setResumenEjecutivo] = useState<ResumenEjecutivo | null>(null);

  // Estados conocidos
  const estadosConocidos = [
    { id: "1", nombre: "Sin asignar" },
    { id: "2", nombre: "Prospecto" },
    { id: "3", nombre: "En Preparación" },
    { id: "4", nombre: "Comité Sup." },
    { id: "5", nombre: "Aprobado" },
    { id: "6", nombre: "Rechazado" },
    { id: "7", nombre: "Cursado" },
  ];

  useEffect(() => {
    const fetchResumen = async () => {
      try {
        const response = await axios.get<ResumenEjecutivo>(
          `https://bansur-api-express.vercel.app/api/resumen/ejecutivo_completo`
        );
        setResumenEjecutivo(response.data);
      } catch (error) {
        console.error("Error al obtener el resumen", error);
      }
    };

    fetchResumen();
  }, []);

  if (!resumenEjecutivo) {
    return <p>Cargando...</p>;
  }

  const ejecutivos = [
    { nombre: "Macarena Calistro", key: "2" },
    { nombre: "Edward Saldaña", key: "3" },
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
          <TableHead>N</TableHead>
          <TableHead>Monto Total</TableHead>
          {estadosConocidos.map((estado) => (
            <TableHead key={estado.id}  className='text-center text-bansur'>
              {estado.nombre}
            </TableHead>
          ))}
        </TableRow>
        <TableRow>
          <TableHead colSpan={3}></TableHead>
          {estadosConocidos.flatMap((estado, index) => [
            <TableHead
              key={`${estado.id}-monto`}
              className={index % 2 === 0 ? "bg-bansur/10" : ""}
            >
              Monto
            </TableHead>,
            /*<TableHead
              key={`${estado.id}-clientes`}
              className={index % 2 === 0 ? "bg-bansur/10" : ""}
            >
              N
            </TableHead>*/,
          ])}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(resumenEjecutivo.totalesPorEjecutivo).map(
          ([key, { totalMonto, totalClientes, estados }], index) => (
            <TableRow key={index}>
              <TableCell>{ejecutivoMap.get(key) || `Desconocido (${key})`}</TableCell>
              <TableCell>{totalClientes}</TableCell>
              <TableCell>
                <span className='text-bansur font-semibold'>${new Intl.NumberFormat("es-CL").format(totalMonto)}</span>
              </TableCell>
              {estadosConocidos.flatMap((estado, index) => [
                <TableCell
                  key={`${estado.id}-monto`}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  ${new Intl.NumberFormat("es-CL").format(
                    estados?.[estado.id]?.monto || 0
                  )}
                </TableCell>,
                /*<TableCell
                  key={`${estado.id}-clientes`}
                  className={index % 2 === 0 ? "bg-gray-50" : ""}
                >
                  {estados?.[estado.id]?.clientes || 0}
                </TableCell>*/,
              ])}
            </TableRow>
          )
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell>{resumenEjecutivo.totalClientes}</TableCell>
          <TableCell>
            ${new Intl.NumberFormat("es-CL").format(resumenEjecutivo.sumaTotal)}
          </TableCell>
          {estadosConocidos.flatMap((estado, index) => [
            <TableCell
              key={`total-monto-${estado.id}`}
              className={index % 2 === 0 ? "bg-gray-50" : ""}
            ></TableCell>,
            <TableCell
              key={`total-clientes-${estado.id}`}
              className={index % 2 === 0 ? "bg-gray-50" : ""}
            ></TableCell>,
          ])}
        </TableRow>
      </TableFooter>
    </Table>
  );
}
