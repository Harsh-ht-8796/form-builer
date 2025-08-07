"use client";

import Dashboard from "@/components/dashboard";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";
import { Suspense } from "react";

export default function DashboardPage() {
  return (<Suspense fallback={<DashboardSkeleton />}>
    <Dashboard />;
  </Suspense>)
}
