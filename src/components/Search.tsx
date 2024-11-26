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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PencilSquareIcon } from "@heroicons/react/24/outline";






const SearchComponent: React.FC = () => {
  // Estado para clientes y búsqueda
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState<string>("");

  const URL = 'http://localhost:3000/api/clientes';

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
    ? clientes.filter((dato) =>
        dato.nombre.toLowerCase().includes(search.toLowerCase())
      )
    : clientes;

  useEffect(() => {
    showData();
  }, []);

  return (
    <div className="container mx-auto">
      
      <Input 
        type="text" 
        placeholder="Buscar cliente..." 
        value={search}
        onChange={searcher} 
        className="my-6"
        />


<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[400px]">Nombre</TableHead>
      <TableHead>Convenio</TableHead>
      <TableHead>Estado</TableHead>
      <TableHead>Ejecutivo</TableHead>
      <TableHead className="text-right">Monto</TableHead>
      <TableHead></TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {results.map((cliente) => (
    <TableRow key={cliente.id}>
            <TableCell className="font-medium">{cliente.nombre} {cliente.apellido}<br />{cliente.rut}</TableCell>
            <TableCell>{cliente.convenio}</TableCell>
            <TableCell><Badge variant="outline">{cliente.ejecutivo}</Badge>
            </TableCell>
            <TableCell>
              
              <Avatar>
                  <AvatarFallback>{cliente.ejecutivo}</AvatarFallback>
              </Avatar>

              </TableCell>
            <TableCell className="text-right">${cliente.monto}</TableCell>
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
