export const deleteClienteById = async (id: number): Promise<{ success: boolean; message: string }> => {
  const URL = "https://bansur-api-express.vercel.app/api/clientes"; // URL base de la API

  try {
    const response = await fetch(`${URL}/${id}`, { method: "DELETE" }); // Ahora usa la URL real

    if (!response.ok) throw new Error("Error al eliminar el cliente");
    
    return { success: true, message: "Cliente eliminado correctamente" };

  } catch (error) {
    let errorMessage = "Error desconocido";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { success: false, message: errorMessage };
  }
};
