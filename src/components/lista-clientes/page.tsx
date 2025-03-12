import { useEffect, useState } from "react";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import { Cliente } from "@/types/Types.tsx";

const DemoPage: React.FC = () => {
  // ID de los estados de los clientes  
  /* Sin asignar 1
     Prospecto 2
     En Preparación 3
     Comité Superior 4
     Aprobado 5
     Rechazado 6
     Cursado 7 */
  const URL = "https://bansur-api-express.vercel.app/api/clientes?estadoId=1,2,3,4,5"; // sin cursados y rechazados

  const [data, setData] = useState<Payment[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get<Cliente[]>(URL);
        setData(result.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default DemoPage;
