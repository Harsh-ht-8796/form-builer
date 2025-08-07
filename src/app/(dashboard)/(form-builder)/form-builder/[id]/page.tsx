"use client";

import FormBuilderComponent from "@/components/form-builder/form-builder";
import { useParams } from "next/navigation";

export default function FormBuilderPage() {
  const { id } = useParams();
  const formId = Array.isArray(id) ? id[0] : id;
  // const { data: form } = useGetApiV1FormsId(id as string, {
  //   query: {
  //     enabled: !!formId, // Ensure the query is only enabled if formId is defined
  //   }
  // })
  // console.log(form);
  return (
    <FormBuilderComponent id={formId || ''} />
  );
}
