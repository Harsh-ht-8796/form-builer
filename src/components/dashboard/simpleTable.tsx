"use client";

import { SummaryItem } from "@/api/model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormData } from "@/types/dashboard/simple-table";

const SimpleTable = ({ filteredData }: { filteredData: SummaryItem[] }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-medium text-gray-700 py-4 px-6">
              Form name
            </TableHead>
            <TableHead className="font-medium text-gray-700 py-4 px-6 text-right">
              Responses
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((form) => (
            <TableRow
              key={`${form._id?.formId}_${form._id?.accessibility}`}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <TableCell className="py-4 px-6 font-medium text-gray-900">
                {form.formName}
              </TableCell>
              <TableCell className="py-4 px-6 text-right text-gray-700 font-medium">
                {form.responseCount}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SimpleTable;
