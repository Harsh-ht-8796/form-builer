"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { getThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { FormField } from "@/api/model";
import React, { useCallback, useState, useEffect } from "react";
import { useFormStore } from "@/store/formStore";

interface QuestionInputProps {
  question: FormField;
  theme: string;
  index: number;
}

export const QuestionInput = React.memo(({ question, theme, index }: QuestionInputProps) => {

  console.log({ theme })
  const { addOption, updateOption, updateQuestion } = useFormStore();
  const [focusedInputIndex, setFocusedInputIndex] = useState<number | null>(null);

  const handleUpdateOption = useCallback(
    (optionIndex: number, value: string) => {
      setFocusedInputIndex(optionIndex);
      updateOption(index, optionIndex, value);
    },
    [index, updateOption]
  );


  const onDeleteOption = useCallback(
    (optionIndex: number) => {
      const minOptionsRequire: Record<string, number> = {
        "multiple-choice": 2,
        dropdown: 2,
        checkbox: 2,
      };
      if ((question?.options?.length || 0) <= minOptionsRequire[question.type || ""]) {
        return;
      }
      const newOptions = question?.options?.filter((_, i) => i !== optionIndex);
      updateQuestion(index, { options: newOptions });
    },
    [question, index, updateQuestion]
  );

  switch (question.type) {
    case "short-text":
      return (
        <input
          type="text"
          placeholder="Your answer"
          disabled
          className="w-full max-w-md bg-white border-gray-300 border rounded-lg text-base py-2 px-4"
        />
      );

    case "long-text":
      return (
        <input
          placeholder="Your answer"
          disabled
          className="w-full max-w-md bg-white border-gray-300 border rounded-lg text-base py-3 my-2 px-4 min-h-[120px]"
        />
      );

    case "multiple-choice":
      return (
        <div className="space-y-3">
          <RadioGroup>
            {question?.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  className="bg-white"
                  id={`${question.id}-radio-${optionIndex}`}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    id={`option-input-${question.id}-${optionIndex}`}
                    value={option}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleUpdateOption(optionIndex, e.target.value);
                    }}
                    onFocus={() => setFocusedInputIndex(optionIndex)}
                    className="bg-transparent border-none outline-none text-slate-600"
                  />
                  <X
                    className="w-4 h-4 text-slate-400 cursor-pointer"
                    onClick={() => onDeleteOption(optionIndex)}
                  />
                </div>
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={() => addOption(index)}
            className={cn("flex items-center space-x-2", getThemeColor(theme, "bg"))}
          >
            <div className="w-4 h-4 border border-current rounded-full flex items-center justify-center">
              <Plus className="w-2 h-2" />
            </div>
            <span>Add options</span>
          </Button>
        </div>
      );

    case "dropdown":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            {question?.options?.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Input
                  type="text"
                  id={`option-input-${question.id}-${optionIndex}`}
                  value={option}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleUpdateOption(optionIndex, e.target.value);
                  }}
                  onFocus={() => setFocusedInputIndex(optionIndex)}
                  className="w-full max-w-md border-gray-300 bg-white text-sm py-2 px-3"
                />
                <X
                  className="w-4 h-4 text-slate-400 cursor-pointer"
                  onClick={() => onDeleteOption(optionIndex)}
                />
              </div>
            ))}
            <Button
              onClick={() => addOption(index)}
              className={cn("text-sm", `${getThemeColor(theme, "bg")} hover:opacity-80`)}
            >
              Add Option
            </Button>
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-3">
          {question?.options?.map((option, optionIndex) => (
            <div key={optionIndex} className="flex items-center space-x-2">
              <Checkbox
                className="bg-white"
                id={`${question.id}-checkbox-${optionIndex}`}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  id={`option-input-${question.id}-${optionIndex}`}
                  value={option}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleUpdateOption(optionIndex, e.target.value);
                  }}
                  onFocus={() => setFocusedInputIndex(optionIndex)}
                  className="bg-transparent border-none outline-none text-slate-600"
                />
                <X
                  className="w-4 h-4 text-slate-400 cursor-pointer"
                  onClick={() => onDeleteOption(optionIndex)}
                />
              </div>
            </div>
          ))}
          <Button
            onClick={() => addOption(index)}
            className={cn("text-sm", `${getThemeColor(theme, "bg")} hover:opacity-80`)}
          >
            Add Option
          </Button>
        </div>
      );

    default:
      return null;
  }
});