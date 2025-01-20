import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export function MonthlyChart2() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("2024-12");
  const [error, setError] = useState(false);

  // Función para obtener datos desde el endpoint
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
      const result = await response.json();
      if (result.length === 0) {
        setError(true); // No hay datos
      } else {
        setData(result);
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
        label: current.format("MMMM YYYY").replace(/^\w/, (c) => c.toUpperCase()), // Capitaliza el primer carácter
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
            No hay datos disponibles para {months.find((m) => m.value === selectedMonth)?.label}
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="fecha"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => dayjs(value).format("DD/MM")}
              />
              {/* Eje Y para Clientes */}
              <YAxis yAxisId="left" />
              {/* Eje Y para Monto (a la derecha) */}
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="fillMonto" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-monto)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-monto)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillClientes" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-clientes)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-clientes)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              {/* Gráfico de Clientes */}
              <Area
                dataKey="totalClientes"
                type="natural"
                fill="url(#fillClientes)"
                fillOpacity={0.4}
                stroke="var(--color-clientes)"
                stackId="a"
                yAxisId="left" // Asocia con el eje Y izquierdo
              />
              {/* Gráfico de Monto */}
              <Area
                dataKey="totalMonto"
                type="natural"
                fill="url(#fillMonto)"
                fillOpacity={0.4}
                stroke="var(--color-monto)"
                stackId="a"
                yAxisId="right" // Asocia con el eje Y derecho
              />
            </AreaChart>
          </ChartContainer>
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
