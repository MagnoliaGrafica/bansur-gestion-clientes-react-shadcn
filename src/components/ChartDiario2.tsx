import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button"

import dayjs from "dayjs";
import "dayjs/locale/es"; // Para los nombres de los meses en español
dayjs.locale("es");

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Configuración de colores y etiquetas para las series
const chartConfig = {
  monto: {
    label: "Monto",
    color: "hsl(var(--chart-1))",
  },
  clientes: {
    label: "Clientes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type DataItem = {
  fecha: string;
  totalMonto: number;
  totalClientes: number;
};

export function MonthlyChart2() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  //const [selectedMonth, setSelectedMonth] = useState("2024-12");
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM"));
  const [error, setError] = useState(false);
  const [showClientes, setShowClientes] = useState(true); // Controlar la visibilidad de Clientes
  const [showMonto, setShowMonto] = useState(true); // Controlar la visibilidad de Monto

  // Función para obtener datos desde el endpoint y completar días faltantes
  const fetchData = async (month: string) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(
        `https://bansur-api-express.vercel.app/api/resumen/historial_clientes_mensual?mes=${month}`
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const result: DataItem[] = await response.json();

      if (result.length === 0) {
        setError(true); // No hay datos
      } else {
        // Ordenar los datos por fecha
        const sortedData = result.sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );

        // Generar todos los días del mes seleccionado
        const startOfMonth = dayjs(`${month}-01`);
        const endOfMonth = startOfMonth.endOf("month");
        const allDays = [];
        let current = startOfMonth;

        while (current <= endOfMonth) {
          const dayOfWeek = current.day();
          // Excluir sábados (6) y domingos (0)
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            allDays.push(current.format("YYYY-MM-DD"));
          }
          current = current.add(1, "day");
        }

        // Combinar los días existentes con los días faltantes
        const completeData = allDays.map((day) => {
          const existingData = sortedData.find((item) => item.fecha === day);
          return (
            existingData || {
              fecha: day,
              totalMonto: 0,
              totalClientes: 0,
            }
          );
        });

        setData(completeData);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Obtener datos cuando cambia el mes
  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

  // Generar opciones de meses desde diciembre de 2024 hasta el mes actual
  const generateMonths = () => {
    const start = dayjs("2024-12-01");
    const today = dayjs().startOf("month");
    const months = [];
    let current = start;

    while (current <= today) {
      months.push({
        value: current.format("YYYY-MM"),
        label: current.format("MMMM YYYY").replace(/^\w/, (c) =>
          c.toUpperCase()
        ), // Capitaliza el primer carácter
      });
      current = current.add(1, "month");
    }
    return months;
  };

  const months = generateMonths();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Clientes y Monto</CardTitle>
        <CardDescription>
          Selecciona un mes para ver los datos correspondientes
        </CardDescription>
        <Select onValueChange={setSelectedMonth} defaultValue={selectedMonth}>
          <SelectTrigger className="w-[200px] mt-4">
            <SelectValue placeholder="Seleccionar mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : error ? (
          <div className="text-center text-muted-foreground">
            No hay datos disponibles para{" "}
            {months.find((m) => m.value === selectedMonth)?.label}
          </div>
        ) : (
          <>
            {/* Botones para mostrar/ocultar clientes y monto */}
            <div className="flex gap-4 mb-4">
              <Button
                className={`btn ${showClientes ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setShowClientes(!showClientes)}
              >
                {showClientes ? "Ocultar Clientes" : "Mostrar Clientes"}
              </Button>
              <Button
                className={`btn ${showMonto ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setShowMonto(!showMonto)}
              >
                {showMonto ? "Ocultar Monto" : "Mostrar Monto"}
              </Button>
            </div>

            <ChartContainer config={chartConfig} style={{ height: '400px' }}>
              <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="fecha"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => dayjs(value).format("DD")}
                />
                {/* Eje Y para Clientes */}
                <YAxis
                  yAxisId="left"
                  tickSize={5}
                  tickFormatter={(value) => value.toFixed(0)}
                  tickCount={5}
                  width={40}
                />
                {/* Eje Y para Monto (a la derecha) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickSize={5}
                  tickFormatter={(value) => value.toFixed(0)}
                  tickCount={5}
                  width={40}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillMonto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-monto)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-monto)" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="fillClientes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-clientes)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-clientes)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                {/* Mostrar solo si showClientes es true */}
                {showClientes && (
                  <Area
                    dataKey="totalClientes"
                    type="natural"
                    fill="url(#fillClientes)"
                    fillOpacity={0.4}
                    stroke="var(--color-clientes)"
                    stackId="a"
                    yAxisId="left"
                  />
                )}
                {/* Mostrar solo si showMonto es true */}
                {showMonto && (
                  <Area
                    dataKey="totalMonto"
                    type="natural"
                    fill="url(#fillMonto)"
                    fillOpacity={0.4}
                    stroke="var(--color-monto)"
                    stackId="a"
                    yAxisId="right"
                  />
                )}
              </AreaChart>
            </ChartContainer>
          </>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {error
                ? "No hay datos disponibles"
                : "Datos mostrados para el mes seleccionado"}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {months.find((m) => m.value === selectedMonth)?.label}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
