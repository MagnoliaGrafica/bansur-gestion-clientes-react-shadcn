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
        [key: string]: number; 
      };
      sumaTotal: number;
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

    export interface ResumenEjecutivoSector {
      fecha: string; // Fecha asociada a la respuesta
      [key: string]: // Clave dinámica, como "3", "4", "7", etc., o "fecha"
        | {
            [key: string]: { // Subclave dinámica, como "1", "2", etc.
              monto: number; // Monto total en esa categoría
              clientes: number; // Número de clientes en esa categoría
            };
          }
        | string; // Clave "fecha" que tiene como valor una cadena de texto
    }
    