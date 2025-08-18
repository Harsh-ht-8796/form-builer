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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useState, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useGetApiV1FormsReceived, getGetApiV1FormsReceivedQueryKey } from "@/api/formAPI";
import { debounce } from "lodash";
import moment from "moment";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface QueryParams {
  limit: number;
  page: number;
  title?: string;
  isActive?: boolean;
  fromDate?: string;
  toDate?: string;
}

export default function ReceivedFormsPage() {
  // Consolidated query parameters state
  const [queryParams, setQueryParams] = useState<QueryParams>({
    limit: 10,
    page: 0,
  });
  const router = useRouter()

  // Separate state for UI filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  // Get query client for invalidation
  const queryClient = useQueryClient();

  // Debounced function to update queryParams.title
  const debouncedUpdateSearchTerm = useMemo(
    () =>
      debounce((term: string) => {
        setQueryParams((prev) => ({
          ...prev,
          title: term || undefined,
        }));
      }, 300),
    []
  );

  // Debounced function to update queryParams.fromDate and queryParams.toDate
  const debouncedUpdateDateRange = useMemo(
    () =>
      debounce((range: DateRange) => {
        setQueryParams((prev) => ({
          ...prev,
          fromDate: range.from ? moment(range.from).format("DD-MM-YYYY") : undefined,
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
      queryKey: [...getGetApiV1FormsReceivedQueryKey(queryParams)],
    });
  }, [queryClient, queryParams]);

  // Fetch data using consolidated query parameters
  const { data: forms } = useGetApiV1FormsReceived(queryParams, {
    query: {
      ...queryParams,
      select(data) {
        const modifiedData = data.docs?.map(doc => ({
          ...doc,
          createdFormByOrgId: doc.createdBy?.orgId?._id,
          createdFormByOrgName: doc.createdBy?.orgId?.name
        }));
        return { docs: modifiedData, meta: data.meta };
      },
    }
  });

  // Handle status filter change
  const onChangeStatus = (status: string) => {
    setStatusFilter(status as "all" | "true" | "false");
    setQueryParams((prev) => {
      const { isActive, ...rest } = prev;
      return {
        ...rest,
        ...(status !== "all" && { isActive: status === "true" }),
      };
    });
  };
  const handleFormClick = (id: string) => {
    router.push(`form/${id}`)
  }
  const columns = [
    {
      accessorKey: "title",
      header: "Form name",
      cell: ({ row }: any) => {
        const title = row.getValue("title");
        const id = row.getValue("_id");
        console.log({ id })
        return (
          <div onClick={() => handleFormClick(id)} className="flex items-center gap-4">
            {title}
          </div>
        );
      },
    },
    {
      accessorKey: "_id",
      header: "Id",

    },
    {
      accessorKey: "createdFormByOrgName",
      header: "Received From",
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
      accessorKey: "createdAt",
      header: "Date Received",
      meta: {
        headerClassName: "text-center",
        cellClassName: "text-center",
      },
    }
  ];

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen rounded-lg">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Received</h1>

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
            initialState={{
              columnVisibility: {
                _id: false,
                id: false,
              },
            }}
            columns={columns}
            data={forms?.docs || []}
          />
        </div>
      </div>
    </div>
  );
}