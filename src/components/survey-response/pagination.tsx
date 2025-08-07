import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function Pagination() {
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>

      <div className="flex items-center gap-1">
        <Button variant="default" size="sm" className="w-8 h-8 p-0 bg-purple-600 hover:bg-purple-700 text-white">
          1
        </Button>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:text-gray-900">
          2
        </Button>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-600 hover:text-gray-900">
          3
        </Button>
        <span className="px-2 text-gray-400">...</span>
      </div>

      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  )
}
