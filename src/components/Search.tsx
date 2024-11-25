import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import axios from "axios";
import { Cliente } from "../types/Types"; 


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
      <input 
        type="text" 
        placeholder="buscar..." 
        value={search}
        onChange={searcher}    
      />
      <table>

    <thead>
      <tr>
        <th>Nombre</th>
        <th>Comuna</th>
        <th>Monto</th>
        <th>Convenio</th>
        <th>Estado</th>
        <th>Canal</th>
        <th>Ejecutivo</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {results.map((cliente) => (
          <tr key={cliente.id}>
            <td>{cliente.nombre} {cliente.apellido}<br />{cliente.rut}</td>
            <td>{cliente.comuna}</td>
            <td>{cliente.monto}</td>
            <td>{cliente.convenio}</td>
            <td>{cliente.estado}</td>
            <td>{cliente.canal}</td>
            <td>{cliente.ejecutivo}</td>
            <td><Link to={`/cliente/${cliente.id}`}>Actualizar - {cliente.id}</Link></td>
          </tr>
        ))}
      
    </tbody>
      </table>
      
    </div>
  );
};

export default SearchComponent;
