import { Pagination } from "./pagination";
import { DataTable } from "../forms-table";
import { useGetApiV1FormsId, useGetApiV1SubmissionsFormIdIndividual } from "@/api/formAPI";
import { useParams } from "next/navigation";
import { FormField } from "@/api/model";
import { useState } from "react";

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
  const { id } = useParams()
  const [page, setPage] = useState(1)
  const { data: formData } = useGetApiV1FormsId(String(id), {
    query: {
      select(data) {
        type FormFieldMap = Record<string, FormField>; // key is field id, value is FormField

        const fieldsData = data?.fields?.reduce<FormFieldMap>((acc, item) => {
          const id = item?.id || ""
          acc[id] = item;
          return acc;
        }, {});

        return { ...data, fields: fieldsData }
      },
    }
  })
  const { data: response } = useGetApiV1SubmissionsFormIdIndividual(String(id), {
    limit: 1,
    page: page - 1
  }, {
    query: {
      enabled: Boolean(!!id),
      select: (data) => {
        const formResponse = data.docs?.at(0)?.data || {}
        const { meta } = data

        const merged = Object.entries(formResponse).map(([id, answer]: any) => {
          const questionObj = formData?.fields && formData?.fields[id];
          return {
            question: questionObj?.title || "Unknown Question",
            answer: typeof answer === "object" ? answer.join(" , ") : answer
          };
        });
        return { singleResponse: merged, meta }
      }
    }
  })
  console.log({ response, formData: formData?.fields })
  // response?.docs?.at(0)?.data || []
  return (
    <>
      <DataTable data={response?.singleResponse || []} columns={columns} />

      <Pagination
        totalPages={Number(response?.meta?.totalDocs)}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
      />
    </>
  );
}
