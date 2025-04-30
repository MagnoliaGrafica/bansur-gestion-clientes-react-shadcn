import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { Cliente } from "../types/Types"; 
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilSquareIcon, UserPlusIcon } from "@heroicons/react/24/outline";


const SearchComponent: React.FC = () => {
  // Estado para clientes y búsqueda
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState<string>("");

  const URL = "https://bansur-api-express.vercel.app/api/clientes";

  // Función para obtener los datos de la API
  const showData = async () => {
    try {
      const response = await axios.get<Cliente[]>(URL);
      setClientes(response.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  // Función para actualizar el estado de la búsqueda
  const searcher = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filtrado de resultados basado en la búsqueda
  const results = search
  ? clientes.filter((dato) => {
      const nombre = dato.nombre?.toLowerCase() || ""; // Asegura que nombre es una cadena
      const apellido = dato.apellido?.toLowerCase() || ""; // Asegura que apellido es una cadena
      const rut = dato.rut?.toLowerCase() || ""; // Asegura que rut es una cadena
      const searchText = search.toLowerCase();

      return nombre.includes(searchText)|| apellido.includes(searchText) || rut.includes(searchText);
    })
  : clientes;


  useEffect(() => {
    showData();
  }, []);

  //calcular fechas
  const calculateDays = (createdAt: string | number | Date, fechaCierre?: string | number | Date | null): number => {
    const startDate = new Date(createdAt); // Fecha de creación
    const endDate = fechaCierre ? new Date(fechaCierre) : new Date(); // Fecha cierre o fecha actual si no tiene cierre
  
    // Calcular la diferencia en milisegundos
    const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
  
    // Convertir la diferencia a días
    return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
  };

  type BadgeVariant =
  | "prospecto"
  | "encomite"
  | "paracurse"
  | "rechazado"
  | "sinrespuesta"
  | "outline"
  | "default"
  | "secondary"
  | "destructive"
  | null
  | undefined;


  const badgeVariants: Record<number, BadgeVariant> = {
    1: "prospecto",
    2: "encomite",
    3: "paracurse",
    4: "rechazado",
    5: "sinrespuesta"
  };
  
  const getBadgeVariant = (id: number | undefined): BadgeVariant =>
    badgeVariants[id || 0] || "outline";

  
  const getInitials = (
    nombre: string | undefined,
    apellido: string | undefined
  ): string => {
    if (!nombre && !apellido) return "N/A";
    const firstInitial = nombre ? nombre.charAt(0).toUpperCase() : "";
    const lastInitial = apellido ? apellido.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };
  
  

  return (
    <div className="container mx-auto">
      <div className="flex justify-between gap-4 my-6">
      <Input 
        type="text" 
        placeholder="Buscar cliente por Nombre o Rut." 
        value={search}
        onChange={searcher}
        />

        <Button asChild variant="outline" >
          <Link to="/cliente/add">
            <UserPlusIcon /> Nuevo Cliente 
          </Link>
        </Button>  
      </div>

<Table>
  <TableCaption>Lista de clientes.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[400px]">Nombre</TableHead>
      <TableHead>Estado</TableHead>
      <TableHead>Ejecutivo</TableHead>
      <TableHead>Monto Solitado</TableHead>
      <TableHead>Monto a Evaluar</TableHead>
      <TableHead className="w-[110px]">Fecha Ingresado</TableHead>
      <TableHead className="w-[110px]">Fecha Cierre</TableHead>
      <TableHead>Total días</TableHead>
      <TableHead>...</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {results.map((cliente) => (
    <TableRow key={cliente.id}>
            <TableCell className="font-medium text-bansur">{cliente.nombre} {cliente.apellido}<br /><span className="text-gray-400 text-md">{cliente.rut}</span><br /><span className="text-bansur/40">conv.:{cliente.gc_convenio.nombre}</span></TableCell>
            <TableCell>
              <Badge variant={getBadgeVariant(cliente.gc_estado?.id)}>
                {cliente.gc_estado ? cliente.gc_estado.nombre : "Sin asignar"}
              </Badge>
            </TableCell>
            <TableCell>
              <Avatar>
                <AvatarFallback>
                  {getInitials(cliente.gc_ban_user?.nombre, cliente.gc_ban_user?.apellido)}
                </AvatarFallback>
              </Avatar>
              </TableCell>
              <TableCell className="text-right">
                ${new Intl.NumberFormat("es-CL").format(cliente.monto)}
            </TableCell>
            <TableCell>
              ${new Intl.NumberFormat("es-CL").format(cliente.montoEvaluar)}
            </TableCell>

            
            <TableCell>{new Date(cliente.createdAt).toLocaleDateString("es-CL")}</TableCell>
           
              <TableCell>
                {cliente.fechaCierre 
                  ? new Date(cliente.fechaCierre).toLocaleDateString("es-CL") 
                  : "-"}
              </TableCell>

              <TableCell>
                    {calculateDays(cliente.createdAt, cliente.fechaCierre)} días
              </TableCell>
          
            
            <TableCell>
            <Button asChild variant="outline" size="icon">
              <Link to={`/cliente/${cliente.id}`}>
                <PencilSquareIcon className="h-4 w-4" />
              </Link>
            </Button>
              </TableCell>
      </TableRow>
    ))}
      
  </TableBody>
</Table>

      
    </div>
  );
};

export default SearchComponent;
