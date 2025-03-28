import * as React from "react";
import { useAuth } from "@/context/AuthContext"; 
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { UserPlusIcon } from "@heroicons/react/24/outline";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedEstado, setSelectedEstado] = React.useState<string>(''); // Selected estado value
  const [estados, setEstados] = React.useState<any[]>([]); // States fetched from API
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");
  
  React.useEffect(() => {
    fetch("https://bansur-api-express.vercel.app/api/estados")
      .then((response) => response.json())
      .then((data) => {
        const estadosFiltrados = (data as { nombre: string }[]).filter(
          (estado) => estado.nombre !== "Rechazado" && estado.nombre !== "Cursado"
        );
        setEstados(estadosFiltrados);
      });
  }, []);
  
  const { hasRole } = useAuth(); // Obtiene la función hasRole desde el contexto de autenticación

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    
  });

  // Function to update filters dynamically
  const handleFilterChange = (columnId: string, value: string | [string, string]) => {
    setColumnFilters((prevFilters) => {
      const existingFilter = prevFilters.find((filter) => filter.id === columnId);
  
      if (existingFilter) {
        return prevFilters.map((filter) =>
          filter.id === columnId ? { ...filter, value } : filter
        );
      } else {
        return [...prevFilters, { id: columnId, value }];
      }
    });
  };
  
  // Manejar cambio de estado
const handleEstadoChange = (estado: string) => {
  const newEstado = estado === "all" ? "" : estado; // Si es "all", limpia el filtro
  setSelectedEstado(newEstado);
  handleFilterChange("gc_estado", newEstado);
};

  // Obtener las filas filtradas
const filteredRows = table.getFilteredRowModel().rows.map((row) => row.original);

// Calcular contador y total basados en la data filtrada
const filteredCount = filteredRows.length;
const filteredTotal = filteredRows.reduce((acc, item: any) => acc + Math.round(item.montoEvaluar || 0), 0);

//filtro fecha mes
const handleMonthChange = (value: string) => {
  if (value === "all") {
    setSelectedMonth(""); // Limpiar el select visualmente
    table.getColumn("createdAt")?.setFilterValue(undefined); // Quitar filtro
  } else {
    setSelectedMonth(value);
    table.getColumn("createdAt")?.setFilterValue(value); // Aplicar filtro de mes
  }
};

  return (
    <div>
      <div className="flex items-center space-x-4">
        <div className="border border-gray-300 shadow-sm rounded-md border-l-bansur border-l-2 p-4 flex flex-col flex-wrap justify-center items-center ">
          <span className="text-gray-700 text-sm">Total Casos</span>
          <span className="text-bansur text-lg font-bold">{filteredCount}</span>  
        </div>
        <div className="border border-gray-300 shadow-sm rounded-md border-l-bansur border-l-2 p-4 flex flex-col flex-wrap justify-center items-center">
          <span className="text-gray-700 text-sm">Monto a evaluar</span>
          <span className="text-bansur text-lg font-bold">  {filteredTotal.toLocaleString("es-CL", { style: "currency", currency: "CLP" })}</span>  
        </div>
      </div>
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Buscar nombres..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        {hasRole([1,2]) && (
          <Input
            placeholder="Filtrar ejecutivos..."
            value={(table.getColumn("gc_ban_user")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("gc_ban_user")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
      
        {/* Filtro de Estado */}
       <Select onValueChange={handleEstadoChange} value={selectedEstado || "all"}>
  <SelectTrigger className="w-[180px] border p-2 rounded-md">
    <SelectValue placeholder="Seleccionar Estado" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Todos los estados</SelectItem>
    {estados.map((estado) => (
      <SelectItem key={estado.nombre} value={estado.nombre}>
        {estado.nombre}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


   {/* Filtro de Fecha */}
        <div>

        <Select onValueChange={handleMonthChange} value={selectedMonth}>
  <SelectTrigger className="w-[180px] border p-2 rounded-md">
    <SelectValue placeholder="Seleccionar Mes" />
  </SelectTrigger>
  <SelectContent>
    {/* Opción para limpiar el filtro */}
    <SelectItem value="all">📅 Ver todos</SelectItem>  
    {months.map((month, index) => (
      <SelectItem key={index} value={(index + 1).toString().padStart(2, "0")}>
        {month}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
     
      </div>
{/* Dropdown para seleccionar columnas */}
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

{/* Botón para agregar nuevo cliente */}
        <Button asChild variant="bansur" className="ml-4">
          <Link to="/cliente/add">
            <UserPlusIcon /> Nuevo Cliente
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
