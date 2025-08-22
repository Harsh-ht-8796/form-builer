import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pagination } from "./pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Fragment, useState } from "react";
import { useParams } from "next/navigation";
import { useGetApiV1FormsFormIdActiveStatus, useGetApiV1SubmissionsFormFormIdFieldsQuestion } from "@/api/formAPI";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);
export function QuestionView() {

  const { id } = useParams()
  const { data: formData } = useGetApiV1FormsFormIdActiveStatus(String(id))
  const [page, setPage] = useState(1)


  const { data: questioWiseAnswer } = useGetApiV1SubmissionsFormFormIdFieldsQuestion(String(id), {
    page: page - 1,
    limit: 1
  })

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{questioWiseAnswer?.field?.title}</h2>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-8">
            {/* !(questioWiseAnswer?.field.type == "short-text" || questioWiseAnswer?.field.type == "long-text") */}
            {!(questioWiseAnswer?.field.type == "short-text" || questioWiseAnswer?.field.type == "long-text") ?
              questioWiseAnswer?.results

                .map((option) => (
                  <div key={option.option} className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-gray-900">
                      {option.option}
                    </div>

                    <div className="flex-1 mx-8">
                      <div className="h-1 bg-gray-100 rounded-full"></div>
                    </div>

                    <div className="text-right">
                      <Select>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue
                            className="text-purple-600 font-medium"
                            placeholder={`Responses ${option.users?.length ?? 0}`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {option.users?.map((user, index: number) => (
                            <SelectItem key={String(user._id + index)} value={String(user._id ?? index)}>
                              {user.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )) :


              <Card className="border border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-[#F3E8FF] p-3 rounded-sm border border-gray-200">
                        <div className="space-y-0.5">
                          <div className="w-4 h-0.5 bg-purple-600 rounded-full"></div>
                          <div className="w-2 h-0.5 bg-purple-600 rounded-full"></div>
                        </div>
                      </div>
                      <span className="text-sm text-[#6B778C] font-medium">
                        Short answer
                      </span>
                    </div>
                    <span className="text-sm text-[#6B778C] font-normal">
                      {questioWiseAnswer?.results.length || 0} responses
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col">
                  {" "}
                  {/* fixed height or use flex-grow on parent */}
                  <h1 className="text-base text-[#464F56] font-medium py-2">
                    {questioWiseAnswer.field.title}
                  </h1>
                  <ScrollArea className="h-100 py-1 rounded-md border">
                    {questioWiseAnswer?.results.map((response) => (
                      <Fragment key={response.submissionId}>
                        <div className="text-sm px-2">{response.answer as unknown as string}</div>
                        <Separator className="my-2" />
                      </Fragment>
                    ))}
                  </ScrollArea>
                </CardContent>
              </Card>

            }

          </div>
        </CardContent>
      </Card>

      <Pagination
        currentPage={page}
        onPageChange={(page) => setPage(page)}
        totalPages={formData?.fields?.length || 0}
      />
    </>
  );
}
