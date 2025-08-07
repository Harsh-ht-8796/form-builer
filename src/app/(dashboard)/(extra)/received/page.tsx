"use client";

import { DataTable } from "@/components/forms-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { receivedFormData } from "@/components/forms-table/data";
import { cn } from "@/lib/utils";

export default function ReceivedFormsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const filteredData = receivedFormData.filter((form) => {
    const matchesSearch =
      form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.receivedFrom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const columns = [
    {
      accessorKey: "formName",
      header: "Form name",
    },
    {
      accessorKey: "id",
      header: "Id",
    },
    {
      accessorKey: "receivedFrom",
      header: "Received From",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-full",
                {
                  "bg-green-100 text-green-800": status === "Active",
                  "bg-red-100 text-red-800": status === "Closed",
                }
              )}
            >
              <span
                className={cn("w-2 h-2 rounded-full", {
                  "bg-green-500": status === "Active",
                  "bg-red-500": status === "Closed",
                })}
              ></span>
              {status}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "dateReceived",
      header: "Date Received",
      meta: {
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
    }
  ];
  return (
    <div className="p-6 bg-white min-h-screen rounded-lg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Received</h1>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder="Search Forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-4 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <DateRangePicker />
          </div>
        </div>
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
