"use client";

import React from "react";
import { ArrowRightLeft, CopyIcon, GripVertical, Trash2 } from "lucide-react";
import type { FormField, FormFieldType } from "@/api/model";
import { QuestionInput } from "@/components/form-builder/question-input";
import { cn } from "@/lib/utils";
import { QuestionTypePopover } from "./question-type-popover";
import { useMemo, useState, useCallback, useEffect } from "react";
import { questionTypes } from "@/constants/question-types";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useFormStore } from "@/store/formStore";
import { QuestionType } from "@/types/dashboard/components/form-builder";

interface QuestionCardProps {
  question: FormField;
  index: number;
  theme: string;
  draggedQuestion: string | null;
  onDragStart: (e: React.DragEvent, questionId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  onDragEnd: () => void;
}

export const QuestionCard = React.memo(
  ({ question, index, theme, draggedQuestion, onDragStart, onDragOver, onDrop, onDragEnd }: QuestionCardProps) => {
    const { updateQuestion, deleteQuestion, duplicateQuestion, toggleRequired } = useFormStore();
    const [showQuestionTypes, setShowQuestionTypes] = useState(false);

    const updateQuestionType = useCallback(
      (type: FormFieldType) => {
        if (type === "multiple-choice" || type === "dropdown" || type === "checkbox") {
          updateQuestion(index, {
            type,
            options: ["Option 1", "Option 2", "Option 3"],
          });
        } else {
          updateQuestion(index, { type });
        }
        setShowQuestionTypes(false);
      },
      [index, updateQuestion]
    );

    const handleUpdateQuestion = useCallback(
      (updates: Partial<FormField>) => {
        updateQuestion(index, updates);
      },
      [index, updateQuestion]
    );


    const filteredTypes = useMemo(() => {
      return questionTypes.filter((type: QuestionType) => type.id !== question.type);
    }, [question.type]);

    return (
      <div
        draggable
        onDragStart={(e) => onDragStart(e, question?.id || "")}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, index)}
        onDragEnd={onDragEnd}
        className={cn(
          `group relative rounded-lg p-6 transition-all duration-200`,
          draggedQuestion === question.id ? "opacity-50 scale-95" : "hover:shadow-md cursor-move"
        )}
      >
        <div className="space-y-4">
          <div className="flex items-start space-x-4 space-y-2">
            <div className="flex items-start py-1 space-x-1">
              <Trash2
                onClick={() => deleteQuestion(index)}
                className="h-4 w-4 text-slate-400 hover:text-red-500 cursor-pointer"
              />
              <GripVertical
                className="w-4 h-4 text-slate-400 cursor-move"
                onDragStart={(e) => onDragStart(e, question.id || "")}
              />
              <DuplicateQuestionPopover
                question={question}
                index={index}
                onDuplicate={() => duplicateQuestion(index)}
                handleRequiredToggle={toggleRequired}
              >
                <CopyIcon className="w-4 h-4 text-slate-400 cursor-pointer" />
              </DuplicateQuestionPopover>
              <QuestionTypePopover
                open={showQuestionTypes}
                questionTypes={filteredTypes}
                onOpenChange={setShowQuestionTypes}
                onSelectType={updateQuestionType}
                id={question.id}
              >
                <ArrowRightLeft className="w-4 h-4 text-slate-400 cursor-pointer" />
              </QuestionTypePopover>
            </div>
            <div>
              <input
                type="text"
                id={`question-title-${question.id}`}
                value={question.title}
                onChange={(e) => {
                  e.stopPropagation();
                  handleUpdateQuestion({ title: e.target.value });
                }}
                className="text-2xl font-normal text-slate-600 bg-transparent border-none outline-none flex-1"
                placeholder="Enter your question"
              />
              <QuestionInput question={question} theme={theme} index={index} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

const DuplicateQuestionPopover = ({
  children,
  question,
  index,
  onDuplicate,
  handleRequiredToggle,
}: {
  children: React.ReactNode;
  question: FormField;
  index: number;
  onDuplicate: (index: number) => void;
  handleRequiredToggle: (index: number, checked: boolean) => void;
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
            onCheckedChange={(checked) => handleRequiredToggle(index, checked)}
            aria-label="Toggle required"
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDuplicate(index)}
          className="flex items-center px-2 py-1.5 cursor-pointer text-muted-foreground"
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          <span>Duplicate</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};