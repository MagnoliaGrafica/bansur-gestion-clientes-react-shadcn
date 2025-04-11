import { useEffect, useState } from "react";
import { getColumns } from "./columns"; // Importamos `getColumns` en vez de `columns`
import { DataTable } from "./data-table";
import axios from "axios";
import { Cliente } from "@/types/Types.tsx";

const DemoPage: React.FC = () => {
  const URL = "https://bansur-api-express.vercel.app/api/clientes?estadoId=1,2,3,4,5,8"; 
  const [data, setData] = useState<Cliente[]>([]); // Cambiado a Cliente[] para evitar errores

  const fetchClientes = async () => {
    try {
      const result = await axios.get<Cliente[]>(URL);
      setData(result.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const onDeleteSuccess = () => {
    fetchClientes(); // Ahora actualiza los datos correctamente tras eliminar
  };

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={getColumns(onDeleteSuccess, fetchClientes)} data={data} />
    </div>
  );
};

export default DemoPage;