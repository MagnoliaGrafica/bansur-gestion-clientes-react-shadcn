import { useEffect, useState } from "react";
import { getAllClientesgg } from "@/api/clientes";
import { Button } from "@/components/ui/button"
import { UserCircleIcon,DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";


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

  const handleExportPDF = () => {
    const table = document.getElementById("table-to-export"); // Capturar la tabla
    if (!table) return;

    html2canvas(table, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190; // Ancho en mm (ajustar según necesidad)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("tabla.pdf");
    });
  };

  return (
    <div className="antialiased bg-gray-100 text-gray-600 h-screen w-full px-4 space-y-4 py-3" >
     
      <section>
        <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 p-4">
          
              <Button variant="outline" onClick={handleExportPDF}>
                <DocumentArrowDownIcon /> Exportar a PDF
                </Button>
          
        </div>
      </section>
      <div id="table-to-export" className="space-y-4">

      
 <section>
    <div className="flex flex-col justify-center h-full">
        <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Resumen por SUCURSAL</h2>
            </header>
            <div className="p-3">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                            <tr>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Sucursal</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Prospecto</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Aceptado</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-center">Aprobado</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-center">Cursado</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                            <tr>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="font-medium text-gray-800">Osorno</div>
                                    </div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[1]?.["Prospecto"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[1]?.["Aceptado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[1]?.["Aprobado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[1]?.["Cursado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="font-medium text-gray-800">Puerto Montt</div>
                                    </div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[2]?.["Prospecto"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[2]?.["Aceptado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[2]?.["Aprobado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[2]?.["Cursado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="font-medium text-gray-800">Temuco</div>
                                    </div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[3]?.["Prospecto"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[3]?.["Aceptado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[3]?.["Aprobado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[3]?.["Cursado"] || 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                            </tr>
                                       
                        </tbody>
                        <tfoot className="text-md font-semibold uppercase text-bansur bg-gray-50 p-10">
                        <tr>
                          <td><span className="ml-2">TOTAL</span></td>
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
                </div>
            </div>
        </div>
    </div>
</section>


<section>
    <div className="flex flex-col justify-center h-full">
        <div className="w-full max-w-3xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Resumen por EJECUTIVO</h2>
            </header>
            <div className="p-3">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                            <tr>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Ejecutivo</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Prospecto</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Aceptado</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-center">Aprobado</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-center">Cursado</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                        {Object.entries(totalesEjecutivos).map(([ejecutivoNombre, estados]) => (
                            <tr key={ejecutivoNombre}>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 py-2 mr-2 sm:mr-3"><UserCircleIcon className="size-7 text-bansur" /></div>
                                        <div className="font-medium text-gray-800">{ejecutivoNombre}</div>
                                    </div>
                                </td>
                                {["Prospecto", "Aceptado", "Aprobado", "Cursado"].map((estado, index) => (
                                <td key={index} className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{estados[estado].toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                ))}
                            </tr>
                         ))}               
                        </tbody>
                        <tfoot className="text-md font-semibold uppercase text-bansur bg-gray-50 p-3">
                          <tr>
                            <td><span className="pl-2">TOTAL</span></td>
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
                </div>
            </div>
        </div>
    </div>
</section>
</div>

    </div>
  );
};

export default Infogg;