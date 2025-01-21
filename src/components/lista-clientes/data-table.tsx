import * as React from "react";
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
    filterFns: {
      dateRange: (row, columnId, filterValue) => {
        // Convertimos la fecha de la base de datos (createdAt)
        const rowDate = new Date(row.original[columnId]);
    
        // Convertimos las fechas de filtro a Date objects
        const [start, end] = filterValue;
        const startDate = new Date(start);
        const endDate = new Date(end);
    
        // Ajustamos las horas de las fechas para que solo se compare el día, mes y año
        startDate.setHours(0, 0, 0, 0); // Establece la hora de inicio a las 00:00:00
        endDate.setHours(23, 59, 59, 999); // Establece la hora de fin a las 23:59:59
    
        // Asegúrate de que las fechas están en el mismo formato para la comparación (timestamps en milisegundos)
        const startTimestamp = startDate.getTime();
        const endTimestamp = endDate.getTime();
        const rowTimestamp = rowDate.getTime();
    
        // Log para verificar las fechas que estamos comparando
        console.log('Fecha de inicio:', startDate.toLocaleString());
        console.log('Fecha de fin:', endDate.toLocaleString());
        console.log('Fecha de la base de datos (rowDate):', rowDate.toLocaleString());
        console.log('startTimestamp:', startTimestamp);
        console.log('endTimestamp:', endTimestamp);
        console.log('rowTimestamp:', rowTimestamp);
    
        // Comparar las fechas usando timestamps
        const isAfterStart = rowTimestamp >= startTimestamp;
        const isBeforeEnd = rowTimestamp <= endTimestamp;
    
        // Log si la fecha está dentro del rango
        console.log('¿La fecha está dentro del rango?', isAfterStart && isBeforeEnd);
    
        return isAfterStart && isBeforeEnd;
      }
    }
    
    
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

   

  return (
    <div>
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Filtrar nombres..."
          value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nombre")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

<Input
  placeholder="Filtrar ejecutivos..."
  value={(table.getColumn("gc_ban_user")?.getFilterValue() as string) ?? ""}
  onChange={(event) =>
    table.getColumn("gc_ban_user")?.setFilterValue(event.target.value)
  }
  className="max-w-sm"
/>

      
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
