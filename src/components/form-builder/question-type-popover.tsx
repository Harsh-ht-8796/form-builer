"use client";

import type React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QuestionType } from "@/types/dashboard/components/form-builder";
import { FormFieldType } from "@/api/model";

interface QuestionTypePopoverProps {
  children: React.ReactNode;
  open: boolean;
  questionTypes: QuestionType[];
  onOpenChange: (open: boolean) => void;
  onSelectType: (type: FormFieldType, id?: string) => void;
  id?: string;
}

export function QuestionTypePopover({
  children,
  open,
  questionTypes,
  onOpenChange,
  onSelectType,
  id,
}: QuestionTypePopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <div className="p-4">
          <h3 className="font-medium text-slate-700 mb-3">Add Question Type</h3>
          <div className="space-y-1">
            {questionTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => onSelectType(type.id, id)}
                  className="w-full flex items-center space-x-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                >
                  <IconComponent className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-700">
                      {type.name}
                    </div>
                    <div className="text-sm text-slate-500">
                      {type.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
