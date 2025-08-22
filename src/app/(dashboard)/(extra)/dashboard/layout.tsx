"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import moment from "moment";
import { debounce } from "lodash";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const experimental_ppr = true;

interface DateRange {
  from: Date | null;
  to: Date | null;
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dateRange, setDateRange] = useState<DateRange>({
    from: searchParams.get("fromDate")
      ? moment(searchParams.get("fromDate"), "DD-MM-YYYY").toDate()
      : null,
    to: searchParams.get("toDate")
      ? moment(searchParams.get("toDate"), "DD-MM-YYYY").toDate()
      : null,
  });

  const debouncedUpdateUrl = useMemo(
    () =>
      debounce((range: DateRange) => {
        const params = new URLSearchParams(searchParams.toString());
        if (range.from) {
          params.set("fromDate", moment(range.from).format("DD-MM-YYYY"));
        } else {
          params.delete("fromDate");
        }
        if (range.to) {
          params.set("toDate", moment(range.to).format("DD-MM-YYYY"));
        } else {
          params.delete("toDate");
        }
        router.push(`?${params.toString()}`, { scroll: false });
      }, 300),
    [router, searchParams]
  );

  const handleDateRangeChange = useCallback(
    (range: DateRange) => {
      setDateRange(range);
      debouncedUpdateUrl(range);
    },
    [debouncedUpdateUrl]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateUrl.cancel();
    };
  }, [debouncedUpdateUrl]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangePicker
          initialRange={dateRange}
          dateFormat="en-GB"
          onRangeChange={handleDateRangeChange}
          className="w-full sm:w-auto bg-white"
        />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="flex justify-end">
            <Skeleton className="h-10 w-64" />
          </div>
          <div>
            {/* AnalyticsCards skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>

            {/* My Forms Card skeleton */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <Skeleton className="h-7 w-32" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      }
    >
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}