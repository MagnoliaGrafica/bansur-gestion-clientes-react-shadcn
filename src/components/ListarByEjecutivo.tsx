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
/*Sin asignar 1
Prospecto 2
Aceptado 3
Comité Superior 4
Aprobado 5
Rechazado 6
Cursado 7 */

  const URL2 = `https://bansur-api-express.vercel.app/api/clientes?estadoId=1,2,3,4,5&banUserId=${user.id}`

  const [data2, setData2] = useState<PaymentEje[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const result2 = await axios.get<Cliente[]>(URL2);
      setData2(result2.data);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto">
      <DataTable columns={columnas} data={data2} />
    </div>
  );
};

export default ListarByEjecutivo;
