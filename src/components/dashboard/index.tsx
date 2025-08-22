"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AnalyticsCards from "@/components/dashboard/analyticsCards";
import SimpleTable from "./simpleTable";
import { useGetApiV1SubmissionsSummary } from "@/api/formAPI";
import { GetApiV1SubmissionsSummaryAccessibility as ApiAccessibility } from "@/api/model";
import { useSearchParams } from "next/navigation";

// Define the accessibility type based on the assumed enum
type ExtendedAccessibility = ApiAccessibility | "all";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Dashboard() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<ExtendedAccessibility>("all");

  // Debounce the search term with a 300ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Get fromDate and toDate from URL query parameters
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  // Pass debouncedSearchTerm as title, typeFilter as accessibility, and fromDate/toDate to the API
  const { data: summeryOfForms, isLoading } = useGetApiV1SubmissionsSummary({
    ...(debouncedSearchTerm ? { title: debouncedSearchTerm } : {}),
    ...(typeFilter && typeFilter !== "all" ? { accessibility: typeFilter } : {}),
    ...(fromDate ? { fromDate: fromDate } : {}),
    ...(toDate ? { toDate: toDate } : {}),
  });

  return (
    <div className="min-h-screen">
      <div>
        <div className="mx-auto">
          {/* Analytics Cards */}
          <AnalyticsCards />

          {/* My Forms Section */}
          <Card className="bg-white">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  My Forms
                </h2>

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

                  {/* Type Filter */}
                  <Select
                    value={typeFilter}
                    onValueChange={(value: ExtendedAccessibility) =>
                      setTypeFilter(value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Table or Skeleton */}
              {isLoading ? (
                <div className="space-y-2">
                  {/* Table header skeleton */}
                  <Skeleton className="h-10 w-full" />
                  {/* Table rows skeletons */}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <SimpleTable filteredData={summeryOfForms?.summary || []} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}