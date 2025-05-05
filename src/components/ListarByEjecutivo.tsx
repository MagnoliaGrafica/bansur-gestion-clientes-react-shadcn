import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Asegúrate de importar el contexto
import axios from "axios";
import { Cliente } from "../types/Types";

import { PaymentEje, columnas } from "@/components/lista-clientes/columns-ejecutivo";
import { DataTable } from "@/components/lista-clientes/data-table";

const ListarByEjecutivo: React.FC = () => {
  const { user } = useAuth(); // Obtiene el usuario desde el contexto de autenticación
  
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado y tiene el rol adecuado
  if (!user || !user.id) {
    navigate("/login"); // Si no está autenticado o no tiene un id de ejecutivo, redirige al login
    return null; // Asegúrate de retornar null mientras se realiza la redirección
  }

  //ID de los estados de los clientes  
/*
Prospecto 1
En Comité 2
Para Curse 3 
Rechazado 4
Sin Respuesta 5
Cursado 6*/

  const URL2 = `https://bansur-api-express.vercel.app/api/clientes?estadoId=1,2,3&banUserId=${user.id}`

  const [data2, setData2] = useState<PaymentEje[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result2 = await axios.get<Cliente[]>(URL2);
        setData2(result2.data); // Set the fetched data into state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // Add this function to refresh data when a state is updated
  const onUpdateSuccess = async () => {
    try {
      const result2 = await axios.get<Cliente[]>(URL2);
      setData2(result2.data);
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };

  return (
    <div className="container mx-auto">
      <DataTable columns={columnas(onUpdateSuccess)} data={data2} />
    </div>
  );
};

export default ListarByEjecutivo;