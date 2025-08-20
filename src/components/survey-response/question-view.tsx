import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "./pagination";
import { questionData, responseOptions } from "./survey-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetApiV1FormsId, useGetApiV1SubmissionsFormFormIdFieldsQuestion } from "@/api/formAPI";

export function QuestionView() {

  const { id } = useParams()
  const { data: formData } = useGetApiV1FormsId(String(id))
  const [page, setPage] = useState(1)


  const { data: questioWiseAnswer } = useGetApiV1SubmissionsFormFormIdFieldsQuestion(String(id), {
    page: page - 1
  })
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{questioWiseAnswer?.field?.title}</h2>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-8">

            {questioWiseAnswer?.results?.map((option, optionIndex) => {
              return (<div key={option.option} className="flex items-center justify-between">
                <div className="text-2xl font-semibold text-gray-900 ">
                  {option.option}
                </div>
                <div className="flex-1 mx-8">
                  <div className="h-1 bg-gray-100 rounded-full"></div>
                </div>
                <div className="text-right">
                  {<Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue className="text-purple-600 font-medium" placeholder={`Responses ${option.users?.length} `} />
                    </SelectTrigger>
                    <SelectContent>
                      {option.users?.map((user, index) => (
                        <SelectItem key={index} value={String(user._id || index)}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  }
                </div>
              </div>)
            })}
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
