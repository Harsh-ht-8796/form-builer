import React from "react";
import { Button } from "@/components/ui/button";
import { FormFieldType } from "@/api/model";
import { questionTypes } from "@/constants/question-types";
import { useFormStore } from "@/store/formStore";
import { QuestionTypePopover } from "./question-type-popover";
import { Plus } from "lucide-react";

interface QuestionBuilderProps {
  showQuestionTypes: boolean;
  onShowQuestionTypesChange: (value: boolean) => void;
}

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  showQuestionTypes,
  onShowQuestionTypesChange,
}) => {
  const { addQuestion } = useFormStore();

  const handleAddQuestion = (type: FormFieldType) => {
    console.log("Adding question from builder:", type); // Debug log
    addQuestion(type);
    onShowQuestionTypesChange(false);
  };

  return (
    <div className="flex items-center mb-6">
      <QuestionTypePopover
        open={showQuestionTypes}
        onOpenChange={onShowQuestionTypesChange}
        onSelectType={handleAddQuestion}
        questionTypes={questionTypes}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-500 hover:text-slate-700"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </QuestionTypePopover>
      <span className="text-[#D9D9D9] font-semibold text-lg">Add a question</span>
    </div>
  );
};