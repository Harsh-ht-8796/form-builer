import { DateRangePicker } from "@/components/ui/date-range-picker";
import type React from "react";

export const experimental_ppr = true

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DateRangePicker />
      </div>
      <div>{children}</div>
    </div>
  );
}
