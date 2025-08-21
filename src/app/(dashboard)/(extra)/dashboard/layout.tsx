"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo, useEffect, Suspense } from "react";
import moment from "moment";
import { debounce } from "lodash";

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
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
