"use client";

import { Palette, PanelTop, Pentagon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { ThemeSelector } from "./theme-selector";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type FormHeaderProps = {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  buttonLists: ButtonLists;
  hideButtons: (key: keyof ButtonLists) => void;
};
type ButtonLists = {
  logo: boolean;
  cover: boolean;
  background: boolean;
};
export function FormHeader({ selectedTheme, onThemeChange, buttonLists, hideButtons }: FormHeaderProps) {
  const [isOpenBackgroundColor, setIsOpenBackgroundColor] = useState(false);

  const handleOpenBackgroundColor = (theme: string) => {
    onThemeChange(theme);
    setIsOpenBackgroundColor(false);
  };

  return (
    <div className="flex items-center space-x-8 ">
      <div className=" flex items-center text-sm font-normal text-[#6B778C] space-x-4 space-y-1 ">
        <Button
          variant={"secondary"}
          onClick={() => hideButtons("logo")}
          className={cn("bg-white", { hidden: !buttonLists.logo })}
        >
          <Pentagon size={18} />
          <span>logo</span>
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => hideButtons("cover")}
          className={cn("bg-white", { hidden: !buttonLists.cover })}
        >
          <PanelTop size={18} />
          <span>Add Cover</span>
        </Button>
        <Popover
          open={isOpenBackgroundColor}
          onOpenChange={setIsOpenBackgroundColor}
        >
          <PopoverTrigger asChild>
            <Button
              variant={"secondary"}
              onClick={() => hideButtons("background")}
              className={cn("bg-white")}
            >
              <Palette size={18} />
              <span>Background</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn("bg-white")}
          >
            <ThemeSelector
              selectedTheme={selectedTheme}
              onThemeChange={handleOpenBackgroundColor}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
