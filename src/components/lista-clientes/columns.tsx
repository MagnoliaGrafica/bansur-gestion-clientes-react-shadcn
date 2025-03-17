import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router";
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Badge } from "@/components/ui/badge";
import { PencilSquareIcon, ArrowsUpDownIcon, Bars3Icon, TrashIcon } from "@heroicons/react/24/outline";

import { deleteClienteById } from "@/api/clientes.ts"; // Importar la función de la API

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

export const getColumns = (onDeleteSuccess: () => void): ColumnDef<Payment>[] => [
  
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
      accessorKey: "monto",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Monto Solicitado <ArrowsUpDownIcon className="size-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("monto") as string); // Cast explícito
        const formatted = new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
        }).format(amount);
  
        return <div className="text-center">{formatted}</div>;
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha ingreso <ArrowsUpDownIcon className="size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as number);
        return <div className="text-center">{date.toLocaleDateString("es-CL")}</div>;
      },
      filterFn: (row, columnId, value) => {
        if (!value) return true; // Si no hay filtro, mostrar todo
    
        const rowDate = new Date(row.getValue(columnId)); // Convertir timestamp a Date
        const rowMonth = (rowDate.getMonth() + 1).toString().padStart(2, "0"); // Obtener MM
    
        return rowMonth === value; // Comparar con el mes seleccionado
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
            Total días <ArrowsUpDownIcon className="size-4" />
          </Button>
        );
      },
      accessorFn: (row) => {
        const createdAt = row.createdAt; 
        const fechaCierre = row.fechaCierre; // Usar `row.fechaCierre` directamente
        return calculateDays(createdAt, fechaCierre);
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string | number;
        const fechaCierre = row.original.fechaCierre; // Acceder a `fechaCierre` desde `row.original`
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
        accessorKey: "gc_ban_user",
        header: () => <div className="text-center">Ejecutivo</div>,
        cell: ({ row }) => {
          const nombre = row.original.gc_ban_user?.nombre as string;
          const apellido = row.original.gc_ban_user?.apellido as string;
          return (
            <div className="text-bansur text-base font-medium">
              {nombre} {apellido} <br />
            </div>
          );
        },
        // Define cómo debe funcionar el filtro
        filterFn: (row, _columnId, filterValue) => {
          const { nombre = "", apellido = "" } = row.original.gc_ban_user || {};
          const fullName = `${nombre} ${apellido}`.toLowerCase();
          return fullName.includes(filterValue.toLowerCase());
        }, 
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const cliente = row.original;
        const [isLoading, setIsLoading] = useState(false);
  
        const handleDelete = async () => {
          setIsLoading(true);
          const response = await deleteClienteById(cliente.id);
          setIsLoading(false);
  
          if (response.success) {
            toast.success("Cliente eliminado", {
              description: "El cliente ha sido eliminado correctamente.",
            });
            onDeleteSuccess(); 
          } else {
            toast.error("Error al eliminar", {
              description: response.message,
            });
          }
        };
  
        return (
          <div className="text-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <Bars3Icon className="size-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
  
                {/* Botón Editar */}
                <DropdownMenuItem asChild>
                  <Link to={`/cliente/${cliente.id}`} className="flex items-center gap-2">
                    <PencilSquareIcon className="h-4 w-4" />
                    Editar
                  </Link>
                </DropdownMenuItem>
  
                {/* Botón Eliminar con Confirmación */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-600 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                      <TrashIcon className="h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará el cliente permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDelete}
                        disabled={isLoading}
                      >
                        {isLoading ? "Eliminando..." : "Sí, eliminar"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];