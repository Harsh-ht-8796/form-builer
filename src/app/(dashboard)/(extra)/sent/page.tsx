"use client";

import {
  getGetApiV1FormsSearchQueryKey,
  useDeleteApiV1FormsId,
  useGetApiV1FormsSearch,
} from "@/api/formAPI";
import { DataTable } from "@/components/forms-table";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo, useEffect } from "react";
import { TfiTrash } from "react-icons/tfi";
import { debounce } from "lodash";
import { GetApiV1FormsSearchParams, GetApiV1FormsSearchStatus } from "@/api/model";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface QueryParams {
  status?: GetApiV1FormsSearchStatus;
  isActive?: boolean;
  limit: number;
  page: number;
  title?: string;
  fromDate?: string;
  toDate?: string;
  mode?: string;
}

export default function SentFormsPage() {
  // Consolidated query parameters state
  const [queryParams, setQueryParams] = useState<GetApiV1FormsSearchParams>({
    isActive: true,
    limit: 10,
    page: 0,
    mode: 'sent'
  });

  const { mutateAsync: deleteForm } = useDeleteApiV1FormsId();

  // Separate state for UI filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">(
    "all"
  );
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });

  // Get query client for invalidation
  const queryClient = useQueryClient();

  // Debounced function to update queryParams.title
  const debouncedUpdateSearchTerm = useMemo(
    () =>
      debounce((term: string) => {
        setQueryParams((prev) => {
          return {
            ...prev,
            title: term, // only add title if term is truthy
          };
        });
      }, 300),
    [setQueryParams]
  );

  // Debounced function to update queryParams.fromDate and queryParams.toDate
  const debouncedUpdateDateRange = useMemo(
    () =>
      debounce((range: DateRange) => {
        setQueryParams((prev) => ({
          ...prev,
          fromDate: range.from
            ? moment(range.from).format("DD-MM-YYYY")
            : undefined,
          toDate: range.to ? moment(range.to).format("DD-MM-YYYY") : undefined,
        }));
      }, 300),
    []
  );

  // Handle search term input changes
  const handleSearchTermChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
      debouncedUpdateSearchTerm(term);
    },
    [debouncedUpdateSearchTerm]
  );

  // Handle date range changes
  const handleDateRangeChange = useCallback(
    (range: DateRange) => {
      setDateRange(range);
      debouncedUpdateDateRange(range);
    },
    [debouncedUpdateDateRange]
  );

  // Clean up debounced functions on component unmount
  useEffect(() => {
    return () => {
      debouncedUpdateSearchTerm.cancel();
      debouncedUpdateDateRange.cancel();
    };
  }, [debouncedUpdateSearchTerm, debouncedUpdateDateRange]);

  // Invalidate query when queryParams changes
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [...getGetApiV1FormsSearchQueryKey(queryParams)],
    });
  }, [queryClient, queryParams]);

  // Fetch data using consolidated query parameters
  const { data: forms } = useGetApiV1FormsSearch(queryParams);

  // const filteredData = useCallback(() => {
  //   console.log({ docs: forms?.docs });
  //   return forms?.docs?.filter((form) => {
  //     const matchesSearch =
  //       form.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;

  //     const matchesStatus =
  //       statusFilter === "all" ||
  //       (statusFilter === "true" && form.isActive) ||
  //       (statusFilter === "false" && !form.isActive);

  //     const formDate = form.createdAt ? new Date(fo
  // rm.createdAt) : null;
  //     const matchesDate =
  //       !dateRange.from ||
  //       !dateRange.to ||
  //       (formDate && formDate >= dateRange.from && formDate <= dateRange.to);

  //     return matchesSearch && matchesStatus && matchesDate;
  //   });
  // }, [forms, searchTerm, statusFilter, dateRange]);

  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      await deleteForm({ id });
      queryClient.invalidateQueries({
        queryKey: [...getGetApiV1FormsSearchQueryKey(queryParams)],
      });
    } catch (error) {
      console.error("Error deleting form:", error);
    }
  };
  const onChangeStatus = (status: string) => {
    setStatusFilter(status as "all" | "true" | "false");
    setQueryParams((prevState: any) => {
      const { isActive, ...rest } = prevState;
      return {
        ...rest,
        ...(status !== "all" && { isActive: status === "true" }),
      };
    });
  };
  const columns = [
    {
      accessorKey: "title",
      header: "Form name",
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "_id",
      header: "_id",
    },
    {
      accessorKey: "allowedDomains",
      header: "Sent To",
    },

    {
      accessorKey: "allowedEmails",
      header: "Sent To",
    },

    {
      accessorKey: "sentTo",
      header: "Sent To",
      cell: ({ row }: any) => {
        const allowedEmails = row.getValue("allowedEmails");
        const allowedDomains = row.getValue("allowedDomains");
        return (
          <div className="flex items-center gap-4">
            {allowedEmails.length > 1 ? allowedEmails.at(0) + " + 1" : allowedEmails.at(0)}
            {allowedDomains.length > 1 ? allowedDomains.at(0) + " + 1" : allowedDomains.at(0)}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Sent Date",
    },
    {
      accessorKey: "id",
      header: "Id",
      display: "none",
    },
    {
      accessorKey: "status",
      header: "Status"
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }: any) => {
        const isActive = row.getValue("isActive");
        return (
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex items-center gap-2 px-2 py-1 text-xs font-medium rounded-full",
                {
                  "bg-green-100 text-green-800": isActive,
                  "bg-red-100 text-red-800": !isActive,
                }
              )}
            >
              <span
                className={cn("w-2 h-2 rounded-full", {
                  "bg-green-500": isActive,
                  "bg-red-500": !isActive,
                })}
              />
              {isActive ? "Active" : "Closed"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      meta: {
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <div className="flex items-center justify-end">
            {status === "published" && (
              <Button
                variant="ghost"
                onClick={() => {
                  router.push(`/form-builder/${row.getValue("_id")}`);
                }}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4 text-gray-500" />
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => handleDelete(row.getValue("_id"))}
              size="sm"
              className="h-8 w-8 p-0"
            >
              <TfiTrash className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen rounded-lg">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Sent</h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search Forms..."
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
                className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={onChangeStatus}>
              <SelectTrigger className="w-full sm:w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <DateRangePicker
              initialRange={dateRange}
              dateFormat="en-GB"
              onRangeChange={handleDateRangeChange}
              className="w-full sm:w-auto bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            initialState={{
              columnVisibility: {
                _id: false,
                id: false,
                allowedEmails: false,
                allowedDomains: false,
                status:false
              },
            }}
            data={forms?.docs || []}
          />
        </div>
      </div>
    </div>
  );
}
