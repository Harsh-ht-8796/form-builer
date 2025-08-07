import type React from "react";
import { ArrowRightLeft, CopyIcon, GripVertical, Trash2 } from "lucide-react";
import type { FormField, FormFieldType } from "@/api/model";
import { QuestionInput } from "@/components/form-builder/question-input";
import { cn } from "@/lib/utils";
import { QuestionTypePopover } from "./question-type-popover";
import { useMemo, useState } from "react";
import { questionTypes } from "@/constants/question-types";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface QuestionCardProps {
  question: FormField;
  index: number; // Add index for useFieldArray
  theme: string;
  draggedQuestion: string | null;
  onDragStart: (e: React.DragEvent, questionId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void; // Update to use index
  onDragEnd: () => void;
  onUpdateQuestion: (index: number, updates: Partial<FormField>) => void; // Update to use index
  onDeleteQuestion: (index: number) => void; // Update to use index
  onAddOption: (index: number) => void; // Update to use index
  onUpdateOption: (index: number, optionIndex: number, value: string) => void; // Update to use index
  onDuplicateQuestion: (index: number) => void; // Update to use index
  handleRequiredToggle: (index: number, checked: boolean) => void; // Update to use index
}

export function QuestionCard({
  question,
  index,
  theme,
  draggedQuestion,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddOption,
  onUpdateOption,
  onDuplicateQuestion,
  handleRequiredToggle,
}: QuestionCardProps) {
  const [showQuestionTypes, setShowQuestionTypes] = useState(false);

  const updateQuestionType = (type: FormFieldType) => {
    if (type === "multiple-choice" || type === "dropdown" || type === "checkbox") {
      onUpdateQuestion(index, {
        type,
        options: ["Option 1", "Option 2", "Option 3"],
      });
    } else {
      onUpdateQuestion(index, { type });
    }
    setShowQuestionTypes(false);
  };

  const filteredTypes = useMemo(() => {
    return questionTypes.filter((type) => type.id !== question.type);
  }, [question.type]);

  const onDeleteOption = (optionIndex: number) => {
    const minOptionsRequire: Record<string, number> = {
      "multiple-choice": 2,
      dropdown: 2,
      checkbox: 2,
    };
    if ((question?.options?.length || 0) <= minOptionsRequire[question.type || ""]) {
      return;
    }
    const newOptions = question?.options?.filter((_, i) => i !== optionIndex);
    onUpdateQuestion(index, { options: newOptions });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, question?.id || "")}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)} // Pass index instead of question.id
      onDragEnd={onDragEnd}
      className={cn(
        `group relative rounded-lg p-6 transition-all duration-200`,
        draggedQuestion === question.id
          ? "opacity-50 scale-95"
          : "hover:shadow-md cursor-move"
      )}
    >
      <div className="space-y-4">
        <div className="flex justify-space-evenly space-x-4 space-y-2">
          <div className="flex items-start py-1 space-x-1">
            <Trash2
              onClick={() => onDeleteQuestion(index)} // Pass index
              className="h-4 w-4 text-slate-400 hover:text-red-500 cursor-pointer"
            />
            <GripVertical
              className="w-4 h-4 text-slate-400 cursor-move"
              onDragStart={(e) => onDragStart(e, question.id || "")}
            />
            <DuplicateQuestionPopover
              question={question}
              index={index} // Pass index
              onDuplicate={() => onDuplicateQuestion(index)} // Pass index
              handleRequiredToggle={handleRequiredToggle}
            >
              <CopyIcon className="w-4 h-4 text-slate-400 cursor-pointer" />
            </DuplicateQuestionPopover>
            <QuestionTypePopover
              open={showQuestionTypes}
              questionTypes={filteredTypes}
              onOpenChange={setShowQuestionTypes}
              onSelectType={updateQuestionType}
              id={question.id} // Still needed for QuestionTypePopover
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-400 cursor-pointer" />
            </QuestionTypePopover>
          </div>
          <div>
            <input
              type="text"
              value={question.title}
              onChange={(e) => onUpdateQuestion(index, { title: e.target.value })} // Pass index
              className="text-2xl font-normal text-slate-600 bg-transparent border-none outline-none flex-1"
              placeholder="Enter your question"
            />
            <QuestionInput
              question={question}
              theme={theme}
              onAddOption={() => onAddOption(index)} // Pass index
              onUpdateOption={(optionIndex, value) =>
                onUpdateOption(index, optionIndex, value) // Pass index
              }
              onDeleteOption={onDeleteOption}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const DuplicateQuestionPopover = ({
  children,
  question,
  index,
  onDuplicate,
  handleRequiredToggle,
}: {
  children: React.ReactNode;
  question: FormField;
  index: number; // Add index
  onDuplicate: (index: number) => void; // Update to use index
  handleRequiredToggle: (index: number, checked: boolean) => void; // Update to use index
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="flex items-center justify-between px-2 py-1.5">
          <label
            htmlFor="required-toggle"
            className="cursor-pointer text-sm text-muted-foreground font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Required
          </label>
          <Switch
            id="required-toggle"
            checked={question.required}
            onCheckedChange={(checked) => handleRequiredToggle(index, checked)} // Pass index
            aria-label="Toggle required"
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDuplicate(index)} // Pass index
          className="flex items-center px-2 py-1.5 cursor-pointer text-muted-foreground"
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};