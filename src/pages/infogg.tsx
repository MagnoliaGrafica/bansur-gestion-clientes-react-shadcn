import { useEffect, useState } from "react";
import { getAllClientesgg } from "@/api/clientes";

// Definir el tipo de estructura de datos
type TotalesPorSucursal = {
  [sucursal: number]: {
    [estado: string]: number;
  };
};

// Función para verificar si la fecha está en el mes actual
const esDelMesActual = (fechaStr: string): boolean => {
  if (!fechaStr) return false;
  const fecha = new Date(fechaStr);
  const ahora = new Date();
  return (
    fecha.getFullYear() === ahora.getFullYear() &&
    fecha.getMonth() === ahora.getMonth()
  );
};

const Infogg = () => {
  const [totales, setTotales] = useState<TotalesPorSucursal>({});
  const [totalesEjecutivos, setTotalesEjecutivos] = useState<Record<number, Record<string, number>>>({});

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getAllClientesgg();

        if (!Array.isArray(data)) {
          console.error("Respuesta inesperada de la API:", data);
          return;
        }

        // Definir las sucursales y estados a filtrar
        const sucursales = [1, 2, 3]; // IDs de sucursales
        const estadosNormales = ["Prospecto", "Aceptado"];
        const estadosConFecha = ["Aprobado", "Cursado"];

        let totalesTemp: TotalesPorSucursal = {};
        sucursales.forEach((sucursal) => {
          totalesTemp[sucursal] = {};
          [...estadosNormales, ...estadosConFecha].forEach((estado) => {
            totalesTemp[sucursal][estado] = 0;
          });
        });

        // Recorrer los datos y calcular los totales
        data.forEach((cliente) => {
          const sucursal = cliente.gc_ban_user?.sucursal;
          const estado = cliente.gc_estado?.nombre;
          const monto = cliente.montoEvaluar || 0;
          const createdAt = cliente.createdAt;

          // Filtrar por estados normales (sin filtro de fecha)
          if (sucursal && estadosNormales.includes(estado)) {
            totalesTemp[sucursal][estado] += monto;
          }

          // Filtrar por estados que requieren fecha del mes actual
          if (sucursal && estadosConFecha.includes(estado) && esDelMesActual(createdAt)) {
            totalesTemp[sucursal][estado] += monto;
          }
        });

        setTotales(totalesTemp);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getAllClientesgg();
  
        if (!Array.isArray(data)) {
          console.error("Respuesta inesperada de la API:", data);
          return;
        }
  
        const estadosInteres = ["Prospecto", "Aceptado", "Aprobado", "Cursado"];
        const totalesPorEjecutivo: Record<string, Record<string, number>> = {};
  
        data.forEach((cliente) => {
          const ejecutivoNombre = cliente.gc_ban_user
            ? `${cliente.gc_ban_user.nombre} ${cliente.gc_ban_user.apellido}`
            : "Desconocido";
  
          const estado = cliente.gc_estado?.nombre;
          const fecha = new Date(cliente.createdAt);
          const esDelMesActual = fecha.getMonth() === new Date().getMonth() && fecha.getFullYear() === new Date().getFullYear();
  
          if (estado && estadosInteres.includes(estado)) {
            if (!totalesPorEjecutivo[ejecutivoNombre]) {
              totalesPorEjecutivo[ejecutivoNombre] = { Prospecto: 0, Aceptado: 0, Aprobado: 0, Cursado: 0 };
            }
  
            if (estado === "Aprobado" || estado === "Cursado") {
              if (esDelMesActual) {
                totalesPorEjecutivo[ejecutivoNombre][estado] += cliente.montoEvaluar || 0;
              }
            } else {
              totalesPorEjecutivo[ejecutivoNombre][estado] += cliente.montoEvaluar || 0;
            }
          }
        });
  
        setTotalesEjecutivos(totalesPorEjecutivo);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };
  
    fetchClientes();
  }, []);

  return (
    <div>
     
      <h1>Tabla de GG</h1>
      <p>Esta es la tabla de GG</p>

      <section className="w-full">
        <h2>Tabla resumen por sucursal</h2>
      <table className="w-1/2">
        <thead className="bg-bansur text-white">
          <tr className="px-5">
            <th>SUCURSAL</th>
            <th>PROSPECTO</th>
            <th>ACEPTADO</th>
            <th>APROBADO</th>
            <th>CURSADO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Osorno</td>
            <td> {(totales[1]?.["Prospecto"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[1]?.["Aceptado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[1]?.["Aprobado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[1]?.["Cursado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
          </tr>
          <tr>
            <td>Puerto Montt</td>
            <td>{(totales[2]?.["Prospecto"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[2]?.["Aceptado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[2]?.["Aprobado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[2]?.["Cursado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
          </tr>
          <tr>
            <td>Temuco</td>
            <td> {(totales[3]?.["Prospecto"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[3]?.["Aceptado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[3]?.["Aprobado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
            <td> {(totales[3]?.["Cursado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</td>
          </tr>
        </tbody>
        <tfoot className="bg-gray-100">
        <tr>
  <td>TOTAL</td>
  {["Prospecto", "Aceptado", "Aprobado", "Cursado"].map((estado, index) => (
    <td key={index}>
      {Object.values(totales)
        .reduce((acc, sucursal) => acc + (sucursal[estado] || 0), 0)
        .toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
    </td>
  ))}
</tr>
        </tfoot>
      </table>
      </section>

      <section>
  <h2>Tabla Resumen por Ejecutivos</h2>
  <table className="w-full">
    <thead className="bg-bansur text-white">
      <tr>
        <th className="w-1/5">EJECUTIVO</th>
        <th className="w-1/5">PROSPECTO</th>
        <th className="w-1/5">ACEPTADO</th>
        <th className="w-1/5">APROBADO</th>
        <th className="w-1/5">CURSADO</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(totalesEjecutivos).map(([ejecutivoNombre, estados]) => (
        <tr key={ejecutivoNombre}>
          <td className="p-3">{ejecutivoNombre}</td>
          {["Prospecto", "Aceptado", "Aprobado", "Cursado"].map((estado, index) => (
            <td key={index}>
              {estados[estado].toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
    <tfoot className="bg-gray-150">
      <tr>
        <td>TOTAL</td>
        {["Prospecto", "Aceptado", "Aprobado", "Cursado"].map((estado, index) => (
          <td key={index}>
            {Object.values(totalesEjecutivos)
              .reduce((acc, ejecutivo) => acc + (ejecutivo[estado] || 0), 0)
              .toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
          </td>
        ))}
      </tr>
    </tfoot>
  </table>
</section>
    </div>
  );
};

export default Infogg;