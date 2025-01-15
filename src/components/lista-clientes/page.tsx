import { useEffect, useState } from "react";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";
import axios from "axios";
import { Cliente } from "@/types/Types.tsx";

const DemoPage: React.FC = () => {

 const URL = "https://bansur-api-express.vercel.app/api/clientes";

  const [data, setData] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get<Cliente[]>(URL);
      setData(result.data);
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
