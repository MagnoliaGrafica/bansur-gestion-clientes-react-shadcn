import { ColumnDef } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
export type Payment = {
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

 //calcular fechas
 const calculateDays = (createdAt: string | number | Date, fechaCierre?: string | number | Date | null): number => {
  const startDate = new Date(createdAt); // Fecha de creación
  const endDate = fechaCierre ? new Date(fechaCierre) : new Date(); // Fecha cierre o fecha actual si no tiene cierre

  // Calcular la diferencia en milisegundos
  const differenceInMilliseconds = endDate.getTime() - startDate.getTime();

  // Convertir la diferencia a días
  return Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
};

//obtener iniciales
const getInitials = (
  nombre: string | undefined,
  apellido: string | undefined
): string => {
  if (!nombre && !apellido) return "N/A";
  const firstInitial = nombre ? nombre.charAt(0).toUpperCase() : "";
  const lastInitial = apellido ? apellido.charAt(0).toUpperCase() : "";
  return `${firstInitial}${lastInitial}`;
};

type BadgeVariant =
  | "sinasignar"
  | "prospecto"
  | "preparacion"
  | "comite"
  | "aprobado"
  | "rechazado"
  | "cursado"
  | "outline"
  | "default"
  | "secondary"
  | "destructive"
  | null
  | undefined;


  const badgeVariants: Record<number, BadgeVariant> = {
    1: "sinasignar",
    2: "prospecto",
    3: "preparacion",
    4: "comite",
    5: "aprobado",
    6: "rechazado",
    7: "cursado"
  };
  
  const getBadgeVariant = (id: number | undefined): BadgeVariant =>
    badgeVariants[id || 0] || "outline";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "nombre",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
        </Button>
      );
    },
    cell: ({ row }) => {
      const nombre = row.getValue("nombre") as string;
      const apellido = row.original.apellido as string;
      const rut = row.original.rut as string;
      return (<div className="text-left">{nombre} {apellido} <br />{rut}</div>);
    },
  },
  {
    accessorKey: "monto",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monto
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("monto") as string); // Cast explícito
      const formatted = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "montoEvaluar",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Monto a evaluar
        </Button>
      );
    },
    cell: ({ row }) => {
      const montoEvaluar = row.getValue("montoEvaluar") as string | number;
  
      // Verificar si montoEvaluar es un valor numérico válido
      const amount = isNaN(Number(montoEvaluar)) || montoEvaluar == null || montoEvaluar === "" ? 0 : parseFloat(montoEvaluar.toString());
  
      const formatted = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
      }).format(amount);
  
      return <div className="text-right">{formatted}</div>;
    },
  },
  
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha ingreso
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as number);
      return <div>{date.toLocaleDateString("es-CL")}</div>;
    },
  },{
  accessorKey: "fechaCierre",
  header: ({ column }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Fecha cierre
      </Button>
    );
  },
  cell: ({ row }) => {
    const fechaCierre = row.getValue("fechaCierre") as string | number | null;

    // Verifica si fechaCierre es nula, vacía o indefinida
    if (!fechaCierre) {
      return <div>-</div>;
    }

    const date = new Date(fechaCierre);
    return <div>{date.toLocaleDateString("es-CL")}</div>;
  },
},

  {
    id: "días",
    header: ({ column }) => { 
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total días
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      const fechaCierre = row.getValue("fechaCierre") as string | number | Date | null;
      const days = calculateDays(createdAt, fechaCierre);

      return <div>{days} días</div>;
    },
  },

  {
    accessorKey: "gc_estado",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estado
        </Button>
      );
    },
    cell: ({ row }) => {
      return (<div>
      <Badge variant={getBadgeVariant(row.original.gc_estado?.id)}>
                {row.original.gc_estado ? row.original.gc_estado?.nombre : "Sin asignar"}
              </Badge>
              </div>);
    },
  },

  {
    accessorKey:"ejecutivo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ejecutivo
        </Button>
      );
    },
    cell: ({ row }) => {
      return (<div> <Avatar>
      <AvatarFallback>
        {getInitials(row.original.gc_ban_user?.nombre, row.original.gc_ban_user.apellido)}
      </AvatarFallback>
    </Avatar></div>);
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      //const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              ...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/*<DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>*/}
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
