"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type PaginationProps = {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Helper: generate page numbers with ellipsis logic
  const getPages = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5 // Adjust how many numbers to show

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  const pages = getPages()

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-700"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, idx) =>
          typeof page === "number" ? (
            <Button
              key={idx}
              variant={page === currentPage ? "default" : "ghost"}
              size="sm"
              className={cn(
                "w-8 h-8 p-0",
                page === currentPage
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "text-gray-600 hover:text-gray-900"
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ) : (
            <span key={idx} className="px-2 text-gray-400">
              {page}
            </span>
          )
        )}
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-700"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
