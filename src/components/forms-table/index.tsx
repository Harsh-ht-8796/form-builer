"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  InitialTableState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialState?: InitialTableState | undefined;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialState = {
    columnVisibility:{
      id: false, // Hide the _id column by default
    }
  },
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    initialState,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const headerClassName =
                  String(header.column.columnDef.meta?.headerClassName) ??
                  "text-center";
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-[#6B6B6B] font-normal text-base",
                      headerClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => {
                  const cellClassName =
                    String(cell.column.columnDef.meta?.cellClassName) ??
                    "text-center";
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "text-[#101828] font-normal text-sm",
                        cellClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
