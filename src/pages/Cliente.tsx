import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Cliente } from "../types/Types";

const ClienteDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [elCliente, setElCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const URL = "http://localhost:3000/api/clientes/";

  const showData = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Cliente>(`${URL}${params.id}`);
      if (response.data) {
        setElCliente(response.data);
        setError(null);
      } else {
        setError("Cliente no encontrado");
      }
    } catch (error) {
      setError("Error al cargar los datos del cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (elCliente) {
      const { name, value } = e.target;
      setElCliente({ ...elCliente, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elCliente) return;

    try {
      setIsSubmitting(true);
      const response = await axios.put(`${URL}${elCliente.id}`, elCliente);
      if (response.status === 200) {
        alert("Cliente actualizado con éxito");
        navigate("/");
      }
    } catch (error) {
      alert("Error al actualizar el cliente. Revisa el backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    showData();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Editar Cliente {params.id}</h1>

      {elCliente && (
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={elCliente.nombre || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={elCliente.apellido || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={elCliente.email || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Rut:
            <input
              type="text"
              name="rut"
              value={elCliente.rut || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Empresa:
            <input
              type="text"
              name="empresa"
              value={elCliente.empresa || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Comuna:
            <input
              type="text"
              name="comuna"
              value={elCliente.comuna || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Monto:
            <input
              type="number"
              name="monto"
              value={elCliente.monto || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Convenio:
            <input
              type="text"
              name="convenio"
              value={elCliente.convenio || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Estado:
            <input
              type="text"
              name="estado"
              value={elCliente.estado || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Canal:
            <input
              type="text"
              name="canal"
              value={elCliente.canal || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Ejecutivo:
            <input
              type="text"
              name="ejecutivo"
              value={elCliente.ejecutivo || ""}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ClienteDetail;


/*import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Cliente } from "../../types/Types";

const ClienteDetail = () => {
  const params = useParams();
  const [elCliente, setElCliente] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null); // Nuevo estado para manejo de errores
  const [loading, setLoading] = useState<boolean>(true); // Estado de carga

  const URL = 'http://localhost:3000/api/clientes/';

  // Función para obtener los datos de la API
  const showData = async () => {
    try {
      setLoading(true); // Iniciar carga
      const response = await axios.get<Cliente>(`${URL}${params.id}`);
      if (response.data) {
        setElCliente(response.data);
        setError(null); // Limpiar errores si la respuesta es exitosa
      } else {
        setError("Cliente no encontrado"); // Si no se encuentra el cliente
      }
    } catch (error) {
      setError("Error al cargar los datos del cliente."); // Mensaje de error
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  useEffect(() => {
    showData();
  }, [params.id]);

  if (loading) {
    return <p>Loading...</p>; // Mientras se carga el cliente
  }

  if (error) {
    return <p>{error}</p>; // Si hay un error, mostrarlo
  }

  return (
    <>
      <h1>Cliente {params.id}</h1>

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
          </tr>
        </thead>
        <tbody>
          {elCliente ? (
            <tr key={elCliente.id}>
              <td>{elCliente.nombre} {elCliente.apellido}<br />{elCliente.rut}</td>
              <td>{elCliente.comuna}</td>
              <td>{elCliente.monto}</td>
              <td>{elCliente.convenio}</td>
              <td>{elCliente.estado}</td>
              <td>{elCliente.canal}</td>
              <td>{elCliente.ejecutivo}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={7}>No se encontraron datos para este cliente.</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ClienteDetail;*/

