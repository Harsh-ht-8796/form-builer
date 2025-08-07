"use client";

import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { getThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { FormField } from "@/api/model";

interface QuestionInputProps {
  question: FormField;
  theme: string;
  onAddOption: () => void;
  onDeleteOption: (index: number) => void;
  onUpdateOption: (index: number, value: string) => void;
}

export function QuestionInput({
  question,
  theme,
  onAddOption,
  onUpdateOption,
  onDeleteOption,
}: QuestionInputProps) {
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
            {question?.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  className="bg-white"
                  id={`${question.id}-radio-${index}`}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => onUpdateOption(index, e.target.value)}
                    className="bg-transparent border-none outline-none text-slate-600"
                  />
                  <X
                    className="w-4 h-4 text-slate-400 cursor-pointer"
                    onClick={() => onDeleteOption(index)}
                  />
                </div>
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={onAddOption}
            className={cn(
              "flex items-center space-x-2",
              getThemeColor(theme, "bg")
            )}
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
            {question?.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={option}
                  onChange={(e) => onUpdateOption(index, e.target.value)}
                  className="w-full max-w-md border-gray-300 bg-white text-sm py-2 px-3"
                />
                <X
                  className="w-4 h-4 text-slate-400 cursor-pointer"
                  onClick={() => onDeleteOption(index)}
                />
              </div>
            ))}
            <Button
              onClick={onAddOption}
              className={cn(
                "text-sm",
                `${getThemeColor(theme, "bg")} hover:opacity-80`
              )}
            >
              Add Option
            </Button>
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="space-y-3">
          {question?.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Checkbox
                className="bg-white"
                key={"check_box" + index}
                id={`${question.id}-checkbox-${index}`}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) => onUpdateOption(index, e.target.value)}
                  className="bg-transparent border-none outline-none text-slate-600"
                />
                <X
                  className="w-4 h-4 text-slate-400 cursor-pointer"
                  onClick={() => onDeleteOption(index)}
                />
              </div>
            </div>
          ))}
          <Button
            onClick={onAddOption}
            className={cn(
              "text-sm",
              `${getThemeColor(theme, "bg")} hover:opacity-80`
            )}
          >
            Add Option
          </Button>
        </div>
      );

    default:
      return null;
  }
}
