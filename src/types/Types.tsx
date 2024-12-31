export interface defaultLayoutProps{
    children: React.ReactNode
}

export interface Props {
    children: React.ReactNode
    name: string
    path: string // Nueva propiedad para la ruta
    isOpen: boolean
  }

  export interface NewCliente {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    email?: string; // Propiedad opcional
    empresa?: string; // Propiedad opcional
    monto?: number; // Propiedad opcional
    montoEvaluar?: number; // Propiedad opcional
    estado?: number; // Propiedad opcional
    canal?: number; // Propiedad opcional
    ejecutivo?: number; // Propiedad opcional
    convenio?: number; // Propiedad opcional
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
    gc_convenio: gc_convenio;
    gc_tipoCredito: TipoCredito;
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

  export interface Convenios {
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

    interface gc_convenio {
      id: number,
      nombre:string
    }  

  export interface ResumenCanal {
      fecha: string;
      totalesPorCanal: {
        [key: string]: {
          monto: number; 
          clientes: number; 
        }; 
      };
      sumaTotal: number;
      clientes: number;
    }

    export interface ResumenSector {
      fecha: string;
      totalesPorSector: {
        [key: string]: number; 
      };
      sumaTotal: number;
    }

    export interface ResumenEstados {
      fecha: string;
      totalesPorEstado: {
        [key: string]: {
          monto: number; 
          clientes: number; 
        }; 
      };
      sumaTotal: number;
      clientes: number;
    }

    export interface ResumenEjecutivo {
      fecha: string;
      totalesPorEjecutivo: {
        [key: string]: {
          monto: number; // Monto total por ejecutivo
          clientes: number; // Número de clientes por ejecutivo
        };
      };
      sumaTotal: number; // Suma de todos los montos
      clientes: number; // Total de clientes en todos los ejecutivos
    }