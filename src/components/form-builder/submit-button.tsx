"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getThemeColor } from "@/lib/theme";

interface SubmitButtonProps {
  theme: string;
  onSubmit: () => void;
  label: string;
}

export function SubmitButton({
  theme,
  onSubmit,
  label
}: SubmitButtonProps) {
  return (
    <div className="mt-8 space-y-6">
      <Button
        onClick={onSubmit}
        className={cn(
          `${getThemeColor(
            theme,
            "bg"
          )} hover:opacity-90 text-white px-6 py-2 rounded-md font-medium`
        )}
      >
        {label}
      </Button>

    </div>
  );
}
