import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import axios from "axios";
import { NewCliente, Convenios, Canales } from "../types/Types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


const AddClienteEjecutivo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id; // ID del usuario autenticado

  // Estados principales
  const [elCliente, setElCliente] = useState<NewCliente>({
    id: 0,
    nombre: "",
    apellido: "",
    rut: "",
    email: "",
    monto: 0,
    montoEvaluar: 0,
    estado: 1,  // prospecto x defecto
    canal: 0,  
    ejecutivo: userId || 0, // Inicializar con el ID del usuario autenticado
    convenio: 0,
  });

  const [convenios, setConvenios] = useState<Convenios[]>([]);
  const [canal, setCanal] = useState<Canales[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // URLs
  const CLIENTE_API_URL = "https://bansur-api-express.vercel.app/api/clientes/";
  const CONVENIOS_API_URL = "https://bansur-api-express.vercel.app/api/convenios";
  const CANAL_API_URL = "https://bansur-api-express.vercel.app/api/canal";

  // Obtener convenios, canales y estados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resConvenios, resCanales] = await Promise.all([
          axios.get<Convenios[]>(CONVENIOS_API_URL),
          axios.get<Canales[]>(CANAL_API_URL),
        ]);

        setConvenios(
          resConvenios.data.sort((a, b) => a.nombre.localeCompare(b.nombre)) // Ordenar por nombre
        );
        setCanal(resCanales.data);
      } catch (error: any) {
        console.error("Error fetching data:", error.message || error);
        setError("Error al cargar los datos necesarios.");
      }
    };

    fetchData();
  }, []);

  // Manejar cambios en los inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    // Convertir a number si el input es de tipo "number"
    const newValue = type === "number" ? (value === "" ? "" : Number(value)) : value;

    setElCliente((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Manejar selección de valores
  const handleSelectionChange = (key: string, value: string) => {
    setElCliente((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await axios.post(CLIENTE_API_URL, elCliente);
      if (response.status === 200) {
        alert("Cliente creado con éxito.");
        navigate("/clientes");
      }
    } catch (error: any) {
      console.error("Error creating client:", error.message || error);
      alert("Error al crear el cliente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Card className="w-[550px]">
          <CardHeader>
            <CardTitle>Agregar Cliente Ejecutivo</CardTitle>
            <CardDescription>Completa la información del cliente.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  name="nombre"
                  type="text"
                  value={elCliente.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  name="apellido"
                  type="text"
                  value={elCliente.apellido}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rut">Rut</Label>
                <Input name="rut" type="text" value={elCliente.rut} onChange={handleInputChange} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="monto">Monto Solicitado</Label>
                <Input
                  name="monto"
                  type="number"
                  value={elCliente.monto}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="montoEvaluar">Monto a Evaluar</Label>
                <Input
                  name="montoEvaluar"
                  type="number"
                  value={elCliente.montoEvaluar}
                  onChange={handleInputChange}
                />
              </div>
              {/* Canal */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="canal">Canal</Label>
                <Select
                  value={String(elCliente.canal)}
                  onValueChange={(value) => handleSelectionChange("canal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {canal.map((can) => (
                      <SelectItem key={can.id} value={String(can.id)}>
                        {can.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Convenios */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="convenios">Convenios</Label>
                <Select
                  value={String(elCliente.convenio)}
                  onValueChange={(value) => handleSelectionChange("convenio", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Convenios" />
                  </SelectTrigger>
                  <SelectContent>
                    {convenios.map((convenio) => (
                      <SelectItem key={convenio.id} value={String(convenio.id)}>
                        {convenio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default AddClienteEjecutivo;

