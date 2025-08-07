import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import AnalyticsCardsSkeleton from "./analytics-cards-skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen">
      <div>
        <div className="mx-auto">
          {/* Analytics Cards Skeleton */}
          <AnalyticsCardsSkeleton />

          {/* My Forms Section Skeleton */}
          <Card className="bg-white">
            <CardContent className="p-6">
              {/* Header Skeleton */}
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-6 w-48" /> {/* My Forms title */}
                <div className="flex items-center gap-4">
                  {/* Search Input Skeleton */}
                  <Skeleton className="h-10 w-64 rounded-lg" />
                  {/* Type Filter Select Skeleton */}
                  <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
              </div>

              {/* Table Skeleton */}
              <div className="space-y-4">
                {/* Table Header Row Skeleton */}
                <div className="grid grid-cols-4 gap-4 p-2 border-b">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                {/* Table Rows Skeleton */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 p-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
