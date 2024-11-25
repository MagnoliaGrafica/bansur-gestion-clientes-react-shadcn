export interface defaultLayoutProps{
    children: React.ReactNode
}

// Definimos el tipo para los clientes
export interface Cliente {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rut:string;
    empresa: string;
    comuna:string;
    monto: number;
    convenio: number;
    estado: number;
    canal: number;
    ejecutivo: number;
  }