export interface defaultLayoutProps{
    children: React.ReactNode
}

export interface Props {
    children: React.ReactNode
    name: string
    path: string // Nueva propiedad para la ruta
    isOpen: boolean
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
    montoEvaluar: number;
    tipoCredito:number;
    convenio: number;
    sector: number;
    estado: number;
    canal: number;
    ejecutivo: number;
    createdAt: number;
    fechaAsignado:number;
    fechaCierre:number;
    gc_ban_user: gc_ban_user;
    gc_estado: gc_estado;
  }

  export interface Sector { 
    id: number; 
    nombre: string; 
  };

  export interface TipoCredito {
    id: number;
    nombre: string;
  }

  export interface Estados {
    id: number;
    nombre: string;
  }

  export interface Canales {
    id: number;
    nombre: string;
  }

  export interface Ejecutivos {
    id: number;
    nombre: string;
    apellido: string;
  }

  interface gc_ban_user {
    id: number;
    nombre:string;
    apellido:string;
  }

  interface gc_estado {
      id: number,
      nombre:string
    }

  export interface ResumenCanal {
      fecha: string;
      totalesPorCanal: {
        [key: string]: number; 
      };
      sumaTotal: number;
    }