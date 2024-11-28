import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cliente, Sector, TipoCredito, Estados, Canales, Ejecutivos } from "../types/Types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const ClienteDetail = () => {
  const params = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [elCliente, setElCliente] = useState<Cliente | null>(null);
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [tipoCreditos, setTipoCreditos] = useState<TipoCredito[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>("");  
  const [selectedTipoCredito, setSelectedTipoCredito] = useState<string>("");  
  const [estados, setEstados] = useState<Estados[]>([]);
  const [selectedEstados, setSelectedEstados] = useState<string>("");
  const [canal, setCanal] = useState<Canales[]>([]);
  const [selectedCanal, setSelectedCanal] = useState<string>("");
  const [ejecutivo, setEjecutivo] = useState<Ejecutivos[]>([]);
  const [selectedEjecutivo, setSelectedEjecutivo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // URLs
  const CLIENTE_API_URL = "https://bansur-api-express.vercel.app/api/clientes/";
  const SECTOR_API_URL = "https://bansur-api-express.vercel.app/api/sectores";
  const TIPOCREDITO_API_URL = "https://bansur-api-express.vercel.app/api/tipocreditos";
  const ESTADOS_API_URL = "https://bansur-api-express.vercel.app/api/estados";
  const CANAL_API_URL = "https://bansur-api-express.vercel.app/api/canal";
  const EJECUTIVO_API_URL = "https://bansur-api-express.vercel.app/api/ejecutivos";
  const CONVENIOS_API_URL = "https://bansur-api-express.vercel.app/api/convenios";


  // Obtener canales desde la API
  useEffect(() => {
    const fetchCanales = async () => {
      try {
        const response = await axios.get<Canales[]>(CANAL_API_URL);
        setCanal(response.data);
      } catch (error: any) {
        console.error("Error fetching canales:", error.message || error);
        setError("Error al cargar los canales.");
      }
    };
    fetchCanales();
  }, []);


// Obtener ejecutivos desde la API
useEffect(() => {
  const fetchEjecutivos = async () => {
    try {
      const response = await axios.get<Ejecutivos[]>(EJECUTIVO_API_URL);
      setEjecutivo(response.data);
    } catch (error: any) {
      console.error("Error fetching ejecutivos:", error.message || error);
      setError("Error al cargar los ejecutivos.");
    }
  };
  fetchEjecutivos();
}, []);

  // Obtener estados desde la API
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await axios.get<Estados[]>(ESTADOS_API_URL);
        setEstados(response.data);
      } catch (error: any) {
        console.error("Error fetching estados:", error.message || error);
        setError("Error al cargar los estados.");
      }
    };
    fetchEstados();
  }, []);


  // Obtener sectores desde la API
  useEffect(() => {
    const fetchSectores = async () => {
      try {
        const response = await axios.get<Sector[]>(SECTOR_API_URL);
        setSectores(response.data);
      } catch (error: any) {
        console.error("Error fetching sectors:", error.message || error);
        setError("Error al cargar los sectores.");
      }
    };
    fetchSectores();
  }, []);

  // Obtener tipo de créditos desde la API
  useEffect(() => {
    const fetchTipoCredito = async () => {
      try {
        const response = await axios.get<TipoCredito[]>(TIPOCREDITO_API_URL);
        setTipoCreditos(response.data);
      } catch (error: any) {
        console.error("Error fetching tipo de creditos:", error.message || error);
        setError("Error al cargar los tipos de crédito.");
      }
    };
    fetchTipoCredito();
  }, []);

  // Obtener datos del cliente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Cliente>(`${CLIENTE_API_URL}${params.id}`);
        if (response.data) {
          setElCliente(response.data);
          setSelectedSector(String(response.data.sector || ""));
          setSelectedTipoCredito(String(response.data.tipoCredito || ""));
          setSelectedEstados(String(response.data.estado || ""));
          setSelectedCanal(String(response.data.canal || ""));
          setSelectedEjecutivo(String(response.data.ejecutivo || ""));
          setError(null);
        } else {
          setError("Cliente no encontrado.");
        }
      } catch (error: any) {
        console.error("Error fetching client data:", error.message || error);
        setError("Error al cargar los datos del cliente.");
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [params.id]);
  

  // Manejar cambios en los inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
  
    // Convertir a number si el input es de tipo "number"
    const newValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
  
    setElCliente((prev) =>
      prev ? { ...prev, [name]: newValue } : null
    );
  };

    
  // Manejar selección de sector
  const handleRadioChange = (value: string) => {
    setSelectedSector(value);  
    setElCliente((prev) => (prev ? { ...prev, sector: Number(value) } : null)); 
  };

  // Manejar selección de tipo de crédito
  const handleTipoCreditoChange = (value: string) => {
    setSelectedTipoCredito(value);  // Asegurarse de que el valor sea un string
    setElCliente((prev) => (prev ? { ...prev, tipoCredito: Number(value) } : null)); // Convirtiendo a number
  };

  // Manejar selección de estados
  const handleEstadoChange = (value: string) => {
    setSelectedEstados(value);
    setElCliente((prev)=> (prev ? {...prev, estado: Number(value)}: null));
  };

  // Manejar selección de canal
  const handleCanalChange = (value: string) => {
    setSelectedCanal(value);
    setElCliente((prev)=> (prev ? {...prev, canal: Number(value)}: null));
  };

  // Manejar selección de ejecutivo
  const handleEjecutivoChange = (value: string) => {
    setSelectedEjecutivo(value);
    setElCliente((prev)=> (prev ? {...prev, ejecutivo: Number(value)}: null));
  };

  // Validación del formulario
  const validateForm = (): boolean => {
    if (!elCliente?.nombre || !elCliente.email) {
      alert("Por favor, completa los campos obligatorios: Nombre y Email.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(elCliente.email)) {
      alert("Por favor, ingresa un correo electrónico válido.");
      return false;
    }
    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const response = await axios.put(`${CLIENTE_API_URL}${elCliente!.id}`, elCliente);
      if (response.status === 200) {
        alert("Cliente actualizado con éxito.");
        navigate("/clientes");
      }
    } catch (error: any) {
      console.error("Error updating client:", error.message || error);
      alert("Error al actualizar el cliente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {elCliente && (
        <form onSubmit={handleSubmit}>
          <Card className="w-[550px]">
            <CardHeader>
              <CardTitle>Editar Cliente</CardTitle>
              <CardDescription>Actualiza la información del cliente.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    name="nombre"
                    type="text"
                    value={elCliente.nombre || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    name="apellido"
                    type="text"
                    value={elCliente.apellido || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={elCliente.email || ""}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="rut">Rut</Label>
                  <Input 
                    type="text" 
                    name="rut" 
                    value={elCliente.rut || ""} 
                    onChange={handleInputChange} />
                  </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="empresa">Empresa</Label>
                  <Input 
                    type="text" 
                    name="empresa" 
                    value={elCliente.empresa || ""} 
                    onChange={handleInputChange} 
                  />
                  </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="comuna">Comuna</Label>
                  <Input 
                    type="text" 
                    name="comuna" 
                    value={elCliente.comuna || ""} 
                    onChange={handleInputChange} 
                  />
                  </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="monto">Monto</Label>
                  <Input 
                    type="number" 
                    name="monto" 
                    value={elCliente.monto || ""} 
                    onChange={handleInputChange} 
                    />
                  </div>

    
                {/* Tipo de Crédito */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="tipoCredito">Tipo de Crédito</Label>
                  <RadioGroup value={selectedTipoCredito} onValueChange={handleTipoCreditoChange}>
                    {tipoCreditos.map((tipoCredito) => (
                      <div key={tipoCredito.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(tipoCredito.id)} id={`tipocredito-${tipoCredito.id}`} />
                        <Label htmlFor={`tipocredito-${tipoCredito.id}`}>{tipoCredito.nombre}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
    
                <div>convenio</div>

                {/* Sector */}
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="sector">Sector</Label>
                  <RadioGroup value={selectedSector} onValueChange={handleRadioChange}>
                    {sectores.map((sector) => (
                      <div key={sector.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(sector.id)} id={`sector-${sector.id}`} />
                        <Label htmlFor={`sector-${sector.id}`}>{sector.nombre}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

    
                    {/* Estado */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="estado">Estado</Label>
                      <Select value={selectedEstados} onValueChange={handleEstadoChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map((estado) => (
                            <SelectItem key={estado.id} value={String(estado.id)} id={`estado-${estado.id}`}> {estado.nombre} </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Canal */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="canal">Canal</Label> 
                      <Select value={selectedCanal} onValueChange={handleCanalChange}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Canal" />
                        </SelectTrigger>
                        <SelectContent>
                          {canal.map((can)=> (
                            <SelectItem key={can.id} value={String(can.id)} id={`canal-${can.id}`}> {can.nombre} </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>


                    {/* ejecutivo */}
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="ejecutivo">Ejecutivo</Label>
                      <Select value={selectedEjecutivo} onValueChange={handleEjecutivoChange}>
                        <SelectTrigger className="w-[280px]">
                          <SelectValue placeholder="Ejecutivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {ejecutivo.map((executive)=> (
                            <SelectItem key={executive.id} value={String(executive.id)} id={`ejecutivo-${executive.id}`}> {executive.nombre} {executive.apellido}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => navigate("/clientes")}>
                Cancelar
              </Button>
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
