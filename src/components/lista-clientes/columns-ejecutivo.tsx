import { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge";
import { PencilSquareIcon, EllipsisHorizontalIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline";

export type PaymentEje = {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    rut:string;
    empresa: string;
    comuna:string;
    //monto: number;
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
    gc_estado: gc_estado;
    gc_convenio: gc_convenio;
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

type BadgeVariant =
  | "sinasignar"
  | "prospecto"
  | "aceptado"
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
    3: "aceptado",
    4: "comite",
    5: "aprobado",
    6: "rechazado",
    7: "cursado"
  };
  
  const getBadgeVariant = (id: number | undefined): BadgeVariant =>
    badgeVariants[id || 0] || "outline";


  const capitalizeFirstLetter = (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  

  export const columnas: ColumnDef<PaymentEje>[] = [
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre <ArrowsUpDownIcon className="size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const nombre = capitalizeFirstLetter(row.getValue("nombre") as string);
        const apellido = capitalizeFirstLetter(row.original.apellido as string);
        const rut = row.original.rut as string;
        //const convenio = capitalizeFirstLetter(row.original.gc_convenio?.nombre as string);
        const convenio = row.original.gc_convenio?.nombre
        return (
          <div className="text-bansur text-base font-medium">
            {nombre} {apellido} <br />
            <span className="text-gray-400 text-xs">{rut}</span>
            <br />
            <span className="text-gray-500 text-sm ">{convenio}</span>
          </div>
        );
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
            Monto a evaluar <ArrowsUpDownIcon className="size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const montoEvaluar = row.getValue("montoEvaluar") as string | number;
        const amount =
          isNaN(Number(montoEvaluar)) || montoEvaluar == null || montoEvaluar === ""
            ? 0
            : parseFloat(montoEvaluar.toString());
        const formatted = new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
        }).format(amount);
  
        return <div className="text-center font-medium">{formatted}</div>;
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
            Fecha ingreso <ArrowsUpDownIcon className="size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as number); // Convertimos el valor de createdAt
        return <div className="text-center">{date.toLocaleDateString("es-CL")}</div>;
      },
      
    },
    /*{
      accessorKey: "fechaCierre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha cierre <ArrowsUpDownIcon className="size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const fechaCierre = row.getValue("fechaCierre") as string | number | null;
        if (!fechaCierre) {
          return <div className="text-center">-</div>;
        }
        const date = new Date(fechaCierre);
        return <div className="text-center">{date.toLocaleDateString("es-CL")}</div>;
      },
    },*/
    {
      id: "días",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total días <ArrowsUpDownIcon className="size-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        const createdAt = row.createdAt as string | number;
        const fechaCierre = row.fechaCierre as string | number | Date | null;
        return calculateDays(createdAt, fechaCierre);
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string | number;
        const fechaCierre = row.original.fechaCierre;
        const days = calculateDays(createdAt, fechaCierre);
  
        return <div className="text-center">{days} días</div>;
      },
    },
    {
      accessorFn: (row) => row.gc_estado?.nombre || "Sin asignar",
      id: "gc_estado",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Estado <ArrowsUpDownIcon className="size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="text-center">
            <Badge variant={getBadgeVariant(row.original.gc_estado?.id)}>
              {row.original.gc_estado ? row.original.gc_estado?.nombre : "Sin asignar"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <EllipsisHorizontalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Button asChild variant="outline">
                    <Link to={`/cliente/${payment.id}`}>
                      <PencilSquareIcon className="h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
  