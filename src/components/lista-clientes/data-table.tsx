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

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router";
import { UserPlusIcon, CalendarIcon } from "@heroicons/react/24/outline";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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

const formatDateForAPI = (date: Date) => format(date, "yyyy-MM-dd"); // 📌 Sin hora

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedEstado, setSelectedEstado] = React.useState<string>(''); // Selected estado value
  const [estados, setEstados] = React.useState<any[]>([]); // States fetched from API

  
  React.useEffect(() => {
    fetch("https://bansur-api-express.vercel.app/api/estados")
      .then((response) => response.json())
      .then((data) => setEstados(data));
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
  

  // Handle estado filter change
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const estado = e.target.value;
    setSelectedEstado(estado);
    handleFilterChange('gc_estado', estado); 
  };

  //para rango de fechas

  const [fecha, setFecha] = React.useState<DateRange | undefined>(undefined);

  
  const handleFechaChange = (newRange: DateRange | undefined) => {
    if (!newRange?.from) {
      setFecha(undefined);
      handleFilterChange("createdAt", ""); // Eliminar filtro si no hay fecha
      console.log("Filtro limpiado: Sin fecha seleccionada");
      return;
    }
  
    setFecha(newRange);
  
    if (newRange.from && !newRange.to) {
      //  Si solo hay "from", filtrar por ese día
      const fechaFiltrada = formatDateForAPI(newRange.from);
      console.log("Filtrando por una sola fecha:", fechaFiltrada);
      handleFilterChange("createdAt", [fechaFiltrada, fechaFiltrada]); 
    } else if (newRange.from && newRange.to) {
      //  Si hay rango completo, filtrar entre ambas fechas
      const fechaInicio = formatDateForAPI(newRange.from);
      const fechaFin = formatDateForAPI(newRange.to);
      console.log("Filtrando por rango de fechas:", fechaInicio, "hasta", fechaFin);
      handleFilterChange("createdAt", [fechaInicio, fechaFin]);
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-4">
        <div className="border border-gray-300 shadow-md rounded-md border-l-bansur p-4 flex justify-center items-center">
          <span>Total Casos</span>
          <span>0</span>  
        </div>
        <div className="border border-gray-300 shadow-md p-4 flex justify-center items-center">
          <span>Monto</span>
          <span>0</span>
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
        <select
          value={selectedEstado}
          onChange={handleEstadoChange}
          className="border p-2 rounded-md"
        >
          <option value="">Seleccionar Estado</option>
          {estados.map((estado) => (
            <option key={estado.nombre} value={estado.nombre}>
              {estado.nombre}
            </option>
          ))}
        </select>
        
        
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

              {/* Filtro de Fecha */}
        <div className="flex items-center space-x-4">
        <Popover>
        <PopoverTrigger asChild>
        <Button
  id="date"
  variant={"outline"}
  className="w-[300px] justify-start text-left font-normal"
>
  <CalendarIcon />
  {fecha?.from ? (
    fecha.to ? (
      <>
        {format(fecha.from, "dd MMM yyyy", { locale: es })} - {format(fecha.to, "dd MMM yyyy", { locale: es })}
      </>
    ) : (
      format(fecha.from, "dd MMM yyyy", { locale: es }) //  Si solo hay una fecha, mostrarla sola
    )
  ) : (
    <span>Seleccione rango de fechas</span>
  )}
</Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
          locale={es}
            initialFocus
            mode="range"
            defaultMonth={fecha?.from}
            selected={fecha}
            onSelect={handleFechaChange}
            numberOfMonths={2}
            toDate={new Date()} // limita la fecha máxima a hoy
          />
        </PopoverContent>
      </Popover>
      <Button variant="outline" onClick={() => handleFechaChange(undefined)}>
    Limpiar
  </Button>
     
      </div>
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
