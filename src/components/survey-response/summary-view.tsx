"use client";
import { useParams } from "next/navigation";
import { useGetApiV1FormsFormIdActiveStatus, useGetApiV1FormsId } from "@/api/formAPI";
import { FieldCard } from "./FieldCard";




export function SummaryView() {
  const { id } = useParams();
  const { data: formDetails } = useGetApiV1FormsFormIdActiveStatus(String(id), {
    query: {
      enabled: !!id,
    },
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      {formDetails?.fields?.map((field) => <FieldCard key={field._id} field={field} formId={String(id)} />)}
    </div>
  );
}