import { useEffect, useState } from "react";
import { useAuth } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { getAllClientesgg } from "@/api/clientes";
import { Button } from "@/components/ui/button";
import { UserCircleIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Definir el tipo de estructura de datos
type TotalesPorSucursal = {
  [sucursal: number]: {
    [estado: string]: number;
  };
};

type TotalesEjecutivos = {
  [ejecutivo: string]: {
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
  const { isAuthenticated, hasRole } = useAuth(); // Agregamos hasRole
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirige si no está autenticado
    } else if (!hasRole([1, 2])) {
      navigate('/clientes'); // Redirige si el rol no está permitido
    }
  }, [isAuthenticated, hasRole, navigate]);

  if (!isAuthenticated || !hasRole([1, 2])) {
    return null; // Evita renderizar mientras se realiza la redirección
  }

  const [totales, setTotales] = useState<TotalesPorSucursal>({});
  const [totalesEjecutivos, setTotalesEjecutivos] = useState<TotalesEjecutivos>({});

  // Función para normalizar los nombres de los estados
  const normalizarEstado = (estado: string) => {
    const mapEstados: Record<string, string> = {
      "En Comité": "EnComite",
      "Para Curse": "ParaCurse",
    };
    return mapEstados[estado] || estado;
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await getAllClientesgg();

        if (!Array.isArray(data)) {
          console.error("Respuesta inesperada de la API:", data);
          return;
        }

        const sucursales = [1, 2, 3];
        const estadosNormales = ["Prospecto", "EnComite"];
        const estadosConFecha = ["ParaCurse"];

        let totalesTemp: TotalesPorSucursal = {};
        let totalesEjecutivosTemp: Record<string, Record<string, number>> = {}; // Para almacenar los totales por ejecutivo

        sucursales.forEach((sucursal) => {
          totalesTemp[sucursal] = {};
          [...estadosNormales, ...estadosConFecha].forEach((estado) => {
            totalesTemp[sucursal][estado] = 0;
          });
        });

        data.forEach((cliente) => {
          const sucursal = cliente.gc_ban_user?.sucursal;
          const estado = normalizarEstado(cliente.gc_estado?.nombre); // Aplicar normalización
          const monto = cliente.montoEvaluar || 0;
          const createdAt = cliente.createdAt;

          // Sumar para las sucursales
          if (sucursal && estadosNormales.includes(estado)) {
            totalesTemp[sucursal][estado] += monto;
          }

          if (sucursal && estadosConFecha.includes(estado) && esDelMesActual(createdAt)) {
            totalesTemp[sucursal][estado] += monto;
          }

          // Sumar para los ejecutivos
          if (cliente.gc_ban_user?.nombre) {
            const ejecutivoNombre = cliente.gc_ban_user
            ? `${cliente.gc_ban_user.nombre} ${cliente.gc_ban_user.apellido}`
            : "Desconocido";

            if (!totalesEjecutivosTemp[ejecutivoNombre]) {
              totalesEjecutivosTemp[ejecutivoNombre] = {
                Prospecto: 0,
                EnComite: 0,
                ParaCurse: 0
              };
            }

            if (estadosNormales.includes(estado)) {
              totalesEjecutivosTemp[ejecutivoNombre][estado] += monto;
            }

            if (estadosConFecha.includes(estado) && esDelMesActual(createdAt)) {
              totalesEjecutivosTemp[ejecutivoNombre][estado] += monto;
            }
          }
        });

        setTotales(totalesTemp);
        setTotalesEjecutivos(totalesEjecutivosTemp);

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
      const imgWidth = 210; // Ancho en mm (ajustar según necesidad)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      // Obtener la fecha actual en formato DD-MM-YYYY
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Meses en JavaScript van de 0 a 11
      const year = today.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      pdf.save(`Resumen-tubo-comercial-${formattedDate}.pdf`);
    });
  };

  return (
    <div className="antialiased bg-gray-100 text-gray-600 px-4 space-y-3 py-3 pl-28 w-full">
      {/* Exportar a PDF */}
      <section>
        <div className="flex items-center justify-around w-full max-w-5xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200 p-4">
          <Button variant="outline" onClick={handleExportPDF}>
            <DocumentArrowDownIcon /> Exportar a PDF
          </Button>
        </div>
      </section>
    <div id="table-to-export" className="space-y-4">
      {/* Resumen por sucursal */}
      <section>
        <div className="flex flex-col justify-center">
          <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100 flex justify-between">
              <h2 className="font-semibold text-gray-800">RESUMEN POR SUCURSAL</h2>
              <div className="text-bansur mr-4">fecha: <span className="font-bold">{new Date().toLocaleDateString("es-CL")}</span></div>
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
                                    <div className="font-semibold text-left">En Comité</div>
                                </th>
                                <th className="p-2 whitespace-nowrap">
                                    <div className="font-semibold text-left">Para Curse</div>
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
                                  <div className="text-left text-bansur">{(totales[1]?.["Prospecto"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[1]?.["EnComite"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[1]?.["ParaCurse"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="font-medium text-gray-800">Puerto Montt</div>
                                    </div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[2]?.["Prospecto"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[2]?.["EnComite"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[2]?.["ParaCurse"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-2 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="font-medium text-gray-800">Temuco</div>
                                    </div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[3]?.["Prospecto"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[3]?.["EnComite"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                                <td className="p-2 whitespace-nowrap">
                                  <div className="text-left text-bansur">{(totales[3]?.["ParaCurse"] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</div>
                                </td>
                            </tr>
                                       
                        </tbody>
                        <tfoot className="text-md font-semibold uppercase text-bansur bg-gray-50 p-10">
                        <tr>
                          <td>
                            <div className="ml-2 p-3">TOTAL</div>
                          </td>
                          {["Prospecto", "EnComite", "ParaCurse"].map((estado, index) => (
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

      {/* Resumen por ejecutivo */}
      <section>
        <div className="flex flex-col justify-center ">
          <div className="w-full max-w-5xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">RESUMEN POR EJECUTIVO</h2>
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
                        <div className="font-semibold text-left">En Comité</div>
                      </th>
                      <th className="p-2 whitespace-nowrap">
                        <div className="font-semibold text-left">Para Curse</div>
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
      {["Prospecto", "EnComite", "ParaCurse"].map((estado, index) => (
        <td key={index} className="p-2 whitespace-nowrap">
          <div className="text-left text-bansur">
            {(estados[estado] ?? 0).toLocaleString("es-CL", { style: "currency", currency: "CLP" })}
          </div>
        </td>
      ))}
    </tr>
  ))}
</tbody>
                  <tfoot className="text-md font-semibold uppercase text-bansur bg-gray-50 p-3">
                          <tr>
                            <td><div className="ml-2 p-3">TOTAL</div></td>
                            
                            {["Prospecto", "EnComite", "ParaCurse"].map((estado, index) => (
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

