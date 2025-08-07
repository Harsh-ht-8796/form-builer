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

export function QuestionView() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Questions 1</h2>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-6">
          <div className="space-y-8">
            {questionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="text-2xl font-semibold text-gray-900 ">
                  {item.option}
                </div>
                <div className="flex-1 mx-8">
                  <div className="h-1 bg-gray-100 rounded-full"></div>
                </div>
                <div className="text-right">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue className="text-purple-600 font-medium" placeholder={`Responses ${item.responses}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {responseOptions.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Pagination />
    </>
  );
}
