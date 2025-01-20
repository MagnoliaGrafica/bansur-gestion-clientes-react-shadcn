import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import dayjs from "dayjs";

const dataRaw = [
  { fecha: "2025-01-08", totalMonto: 600000, totalClientes: 1 },
  { fecha: "2025-01-08", totalMonto: 1000000, totalClientes: 1 },
  { fecha: "2025-01-09", totalMonto: 7000000, totalClientes: 1 },
  { fecha: "2025-01-13", totalMonto: 1300000, totalClientes: 1 },
  { fecha: "2025-01-14", totalMonto: 20000000, totalClientes: 1 },
  { fecha: "2025-01-16", totalMonto: 2000000, totalClientes: 1 },
  { fecha: "2025-01-17", totalMonto: 4000000, totalClientes: 1 },
];

export function MonthlyChart() {
  const [selectedMonth, setSelectedMonth] = useState("01");

  // Filtrar datos por el mes seleccionado
  const filteredData = useMemo(() => {
    return dataRaw.filter((item) => {
      const month = dayjs(item.fecha).format("MM");
      return month === selectedMonth;
    });
  }, [selectedMonth]);

  // Agrupar datos por fecha
  const groupedData = useMemo(() => {
    return filteredData.reduce((acc, { fecha, totalMonto, totalClientes }) => {
      const existing = acc.find((item) => item.fecha === fecha);
      if (existing) {
        existing.totalMonto += totalMonto;
        existing.totalClientes += totalClientes;
      } else {
        acc.push({ fecha, totalMonto, totalClientes });
      }
      return acc;
    }, [] as { fecha: string; totalMonto: number; totalClientes: number }[]);
  }, [filteredData]);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Selector de Mes */}
      <div className="flex items-center mb-4">
        <Select onValueChange={(value) => setSelectedMonth(value)} defaultValue="01">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="01">Enero</SelectItem>
            <SelectItem value="02">Febrero</SelectItem>
            <SelectItem value="03">Marzo</SelectItem>
            <SelectItem value="04">Abril</SelectItem>
            <SelectItem value="05">Mayo</SelectItem>
            <SelectItem value="06">Junio</SelectItem>
            <SelectItem value="07">Julio</SelectItem>
            <SelectItem value="08">Agosto</SelectItem>
            <SelectItem value="09">Septiembre</SelectItem>
            <SelectItem value="10">Octubre</SelectItem>
            <SelectItem value="11">Noviembre</SelectItem>
            <SelectItem value="12">Diciembre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Gráfico */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={groupedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip formatter={(value: number) => new Intl.NumberFormat("es-CL").format(value)} />
          <Legend />
          <Bar dataKey="totalMonto" fill="#8884d8" name="Monto Total" />
          <Bar dataKey="totalClientes" fill="#82ca9d" name="Clientes Totales" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
