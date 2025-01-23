import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import colors from "tailwindcss/colors";

const ChartEjecutivosDiarios = () => {
  // Obtener la fecha de ayer
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // Restar un día
    return yesterday;
  };

  // Usar la fecha de ayer como valor inicial
  const [selectedDate, setSelectedDate] = useState<Date | null>(getYesterday());

  const [chartData, setChartData] = useState<
    { iniciales: string; nombre: string; monto: number; clientes: number }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const ejecutivos = [
    { nombre: "Macarena Calistro", key: "2" },
    { nombre: "Edward Saldaña", key: "3" },
    { nombre: "Felipe Santana", key: "4" },
    { nombre: "Jeanette Bastidas", key: "5" },
    { nombre: "Pamela Puntareli", key: "6" },
    { nombre: "Lilian Santana", key: "7" },
    { nombre: "Alex Ballota", key: "8" },
    { nombre: "Pedro Salinas", key: "9" },
  ];

  const fetchData = async (fecha: string) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://bansur-api-express.vercel.app/api/resumen/informe_diario_ejecutivo?fecha=${fecha}`
      );
      const data = response.data.totalesPorEjecutivo;

      // Transformar datos para incluir a todos los ejecutivos
      const transformedData = ejecutivos.map((ejecutivo) => {
        const { nombre, key } = ejecutivo;
        const iniciales = nombre
          .split(" ")
          .map((n) => n[0])
          .join("");
        const ejecutivoData = data[key] || { monto: 0, clientes: 0 }; // Si no hay datos, establecer valores predeterminados

        return {
          iniciales,
          nombre,
          monto: ejecutivoData.monto,
          clientes: ejecutivoData.clientes,
        };
      });

      setChartData(transformedData);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("Error al cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
      fetchData(formattedDate);
    }
  }, [selectedDate]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Montos diarios por ejecutivo</CardTitle>
        <div className="mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Selecciona una fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start">
              <Calendar
                mode="single"
                selected={selectedDate ?? undefined} // Si selectedDate es null, se convierte en undefined
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date); // Si `date` no es `undefined`, se asigna
                  } else {
                    setSelectedDate(null); // Si `date` es `undefined`, se asigna `null`
                  }
                }}
                initialFocus
                disabled={(date) =>
                  date < new Date("2024-12-01") || date > new Date() // Fechas fuera del rango permitido
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="iniciales" />
            <YAxis
              tickFormatter={(value) => new Intl.NumberFormat("es-CL", { notation: "compact" }).format(value)}
            />
            <Tooltip
              formatter={(value, name, props) => {
                const { clientes } = props.payload; // Acceder a la cantidad de clientes desde los datos
                const formattedValue = new Intl.NumberFormat("es-CL").format(Number(value));
                return [`${formattedValue} (${clientes} clientes)`, name];
              }}
              labelFormatter={(label) => `Ejecutivo: ${label}`}
            />
            <Bar dataKey="monto" fill={colors.blue[500]} name="Monto" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartEjecutivosDiarios;
