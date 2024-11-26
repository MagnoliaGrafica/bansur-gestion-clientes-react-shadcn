import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cliente } from "../types/Types";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const ClienteDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [elCliente, setElCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const URL = "http://localhost:3000/api/clientes/";

  const showData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Cliente>(`${URL}${params.id}`);
      if (response.data) {
        setElCliente(response.data);
        setError(null);
      } else {
        setError("Cliente no encontrado");
      }
    } catch (error) {
      setError("Error al cargar los datos del cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (elCliente) {
      const { name, value } = e.target;
      setElCliente({ ...elCliente, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elCliente) return;

    try {
      setIsSubmitting(true);
      const response = await axios.put(`${URL}${elCliente.id}`, elCliente);
      if (response.status === 200) {
        alert("Cliente actualizado con éxito");
        navigate("/clientes");
      }
    } catch (error) {
      alert("Error al actualizar el cliente. Revisa el backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    showData();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      
      {elCliente && (
        <form onSubmit={handleSubmit}>
        <Card className="w-[550px]">
      <CardHeader>
        <CardTitle>Cliente Registrado</CardTitle>
        <CardDescription>editar</CardDescription>
      </CardHeader>
      <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input name="nombre" type="text" value={elCliente.nombre || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="apellido">Apellido</Label>
              <Input name="apellido" type="text" value={elCliente.apellido || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" value={elCliente.email || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="rut">Rut</Label>
              <Input name="rut" type="text" value={elCliente.rut || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="empresa">Empresa</Label>
              <Input name="empresa" type="text" value={elCliente.empresa || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="comuna">Comuna</Label>
              <Input name="comuna" type="text" value={elCliente.comuna || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="monto">Monto</Label>
              <Input name="monto" type="number" value={elCliente.monto || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="convenio">Convenio</Label>
              <Input name="convenio" type="text" value={elCliente.convenio || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="estado">Estado</Label>
              <Input name="estado" type="text" value={elCliente.estado || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="canal">Canal</Label>
              <Input name="canal" type="text" value={elCliente.canal || ""}
              onChange={handleInputChange} />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="ejecutivo">Ejecutivo</Label>
              <Input name="ejecutivo" type="text" value={elCliente.ejecutivo || ""}
              onChange={handleInputChange} />
            </div>
          </div>
        
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
      </CardFooter>
    </Card>  
        </form>
      )}
    </div>
  );
};

export default ClienteDetail;