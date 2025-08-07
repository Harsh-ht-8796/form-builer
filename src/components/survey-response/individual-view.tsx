import { Pagination } from "./pagination";
import { DataTable } from "../forms-table";
import { responseData } from "./survey-data";

const columns = [
  {
    accessorKey: "question",
    header: "Question",
    meta: {
      headerClassName: "text-left",
      cellClassName: "text-left",
    },
  },
  {
    accessorKey: "answer",
    header: "Answer",
    meta: {
      headerClassName: "text-end",
      cellClassName: "text-end",
    },
  },
];

export function IndividualView() {
  return (
    <>
      <DataTable data={responseData} columns={columns} />

      <Pagination />
    </>
  );
}
