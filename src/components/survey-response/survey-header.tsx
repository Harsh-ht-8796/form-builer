"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Switch } from "@/components/ui/switch";
import { MdOutlineGroup } from "react-icons/md";

const VIEWS = {
  INDIVIDUAL: "Individual",
  QUESTION: "Question",
  SUMMARY: "Summary",
};

export function SurveyHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeView, setActiveView] = useState<string>("");

  useEffect(() => {
    const view = pathname.split("/");
    const lastView = view[view.length - 1];
    const firstChar = lastView.charAt(0).toUpperCase();
    const remainingChars = lastView.slice(1);
    setActiveView(firstChar + remainingChars);
  }, []);
  const onViewChange = (view: string) => {
    setActiveView(view);

    router.push(`/dashboard/survey-response/${view.toLowerCase()}`);
  };
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-6">
        {/* Tabs */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-[#464F56]">
              Responses
            </span>
            <Switch id="airplane-mode" />
          </div>
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-[#464F56] font-normal text-sm ">Peoples</span>
            <MdOutlineGroup className="text-2xl" />
            <Badge
              variant="outline"
              className="text-gray-600 !px-0 text-md border-none hover:bg-gray-100"
            >
              34
            </Badge>
          </div>
        </div>

        {/* Toggle Buttons using shadcn Tabs */}
      </div>

      <div className="flex items-center gap-6">
        <Tabs
          value={activeView}
          onValueChange={onViewChange}
          className="w-auto border  border-gray-200 rounded-md py-1 px-2"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white p-0 ">
            <TabsTrigger
              value={VIEWS.INDIVIDUAL}
              className="data-[state=active]:bg-[#F3E8FF]  text-[#6B778C] data-[state=active]:text-[#7C3AED]"
            >
              Individual
            </TabsTrigger>
            <TabsTrigger
              value={VIEWS.QUESTION}
              className="data-[state=active]:bg-[#F3E8FF]  text-[#6B778C] data-[state=active]:text-[#7C3AED]"
            >
              Question
            </TabsTrigger>
            <TabsTrigger
              value={VIEWS.SUMMARY}
              className="data-[state=active]:bg-[#F3E8FF]  text-[#6B778C] data-[state=active]:text-[#7C3AED]"
            >
              Summary
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Download Button */}
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download CSV
        </Button>
      </div>
    </div>
  );
}
