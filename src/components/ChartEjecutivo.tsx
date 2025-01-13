import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import colors from "tailwindcss/colors";

const ChartEjecutivos = () => {
  const [chartData, setChartData] = useState<{ iniciales: string; nombre: string; monto: number; clientes: number }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Definir los ejecutivos y su key correspondiente
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://bansur-api-express.vercel.app/api/resumen/ejecutivo");
        const data = response.data.totalesPorEjecutivo;

        // Transformar los datos para el gráfico
        const transformedData = Object.entries(data).map(([id, { monto, clientes }]: any) => {
          // Buscar el nombre del ejecutivo asociado al ID
          const ejecutivo = ejecutivos.find((ej) => ej.key === id);
          const nombre = ejecutivo?.nombre || `Ejecutivo ${id}`;

          // Obtener iniciales del nombre completo
          const iniciales = nombre
            .split(" ")
            .map((n) => n[0])
            .join("");

          return {
            iniciales,
            nombre,
            monto,
            clientes,
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

    fetchData();
  }, []);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Montos por Ejecutivo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="iniciales" />
            <YAxis />
            <Tooltip
  formatter={(value, _, props) => [
    new Intl.NumberFormat("es-CL").format(Number(value)),
    props.payload.nombre,
  ]}
/>

            <Bar dataKey="monto" fill={colors.blue[500]} name="Monto" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartEjecutivos;
