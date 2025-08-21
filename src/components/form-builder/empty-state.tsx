"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { QuestionTypePopover } from "@/components/form-builder/question-type-popover";
import { questionTypes } from "@/constants/question-types";
import { FormFieldType } from "@/api/model";
import { useFormStore } from "@/store/formStore";

interface EmptyStateProps {
  theme: string;
  showQuestionTypes: boolean;
  onShowQuestionTypesChange: (show: boolean) => void;
}

export function EmptyState({
  theme,
  showQuestionTypes,
  onShowQuestionTypesChange,
}: EmptyStateProps) {
  const { addQuestion } = useFormStore();

  const handleAddQuestion = (type: FormFieldType) => {
    console.log("Adding question of type:", type); // Debug log
    addQuestion(type);
    onShowQuestionTypesChange(false);
  };

  return (
    <div className="text-center py-12 rounded-lg">
      <div className="text-slate-400 mb-4">
        <Plus className="w-12 h-12 mx-auto mb-3" />
      </div>
      <h3 className="text-lg font-medium text-slate-600 mb-2">
        No questions yet
      </h3>
      <p className="text-slate-500 mb-4">
        Click the + button above to add your first question
      </p>
      <QuestionTypePopover
        open={showQuestionTypes}
        onOpenChange={onShowQuestionTypesChange}
        onSelectType={handleAddQuestion}
        questionTypes={questionTypes}
      >
        <Button
          className={cn(
            `${getThemeColor(theme, "bg")} hover:opacity-90 text-white`
          )}
        >
          Add First Question
        </Button>
      </QuestionTypePopover>
    </div>
  );
}