"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { QuestionTypePopover } from "@/components/form-builder/question-type-popover";
import { questionTypes } from "@/constants/question-types";
import { FormFieldType } from "@/api/model";

interface QuestionBuilderProps {
  showQuestionTypes: boolean;
  onShowQuestionTypesChange: (show: boolean) => void;
  onAddQuestion: (type: FormFieldType) => void;
}

export function QuestionBuilder({
  showQuestionTypes,
  onShowQuestionTypesChange,
  onAddQuestion,
}: QuestionBuilderProps) {
  return (
    <div className="flex items-center mb-6">
      <QuestionTypePopover
        open={showQuestionTypes}
        onOpenChange={onShowQuestionTypesChange}
        onSelectType={onAddQuestion}
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
}
