"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { ScrollArea } from "../ui/scroll-area";
import { Fragment, ReactNode } from "react";
import { Separator } from "../ui/separator";
import { useParams } from "next/navigation";
import { useGetApiV1FormsId } from "@/api/formAPI";
import { FieldCard } from "./FieldCard";

// Mock API hook for field responses (replace with actual API hook)
const useGetApiV1FormsFieldResponses = (formId: string, fieldId: string) => {
  // Simulate API response data for each field
  const mockResponses: Record<string, any> = {
    "1755688384625": ["Response 1", "Response 2", "Response 3", "Response 4"],
    "1755690965072": [
      { name: "Option 1", value: 40, fill: "#FF6B6B" },
      { name: "Option 2", value: 30, fill: "#4ECDC4" },
      { name: "Option 3", value: 20, fill: "#45B7D1" },
    ],
  };

  return {
    data: mockResponses[fieldId] || [],
    isLoading: false,
    error: null,
  };
};

// Define interfaces for data types
interface PieChartData {
  name: string;
  value: number;
  fill: string;
}

interface VerticalBarData {
  option: string;
  value: number;
}

interface HorizontalBarData {
  month: string;
  desktop: number;
}

interface CardConfig {
  id: string;
  title: string;
  description: string;
  responses: number;
  type: string;
  data: PieChartData[] | VerticalBarData[] | HorizontalBarData[] | string[];
}

const chartConfig = {
  name: {
    label: "Visitors",
  },
  value: {
    label: "Option",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Map field types to card config and data
const mapFieldToCardConfig = (
  field: any,
  responseData: any
): CardConfig => {
  switch (field.type) {
    case "short-text":
      return {
        id: field.id,
        type: "short-answer",
        title: field.title,
        description: "",
        responses: responseData?.length || 0,
        data: responseData || [],
      };
    case "multiple-choice":
      return {
        id: field.id,
        type: "pie",
        title: field.title,
        description: "",
        responses: responseData?.length || 0,
        data:
          responseData ||
          field.options.map((option: string, index: number) => ({
            name: option,
            value: 0,
            fill: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"][index % 4],
          })),
      };
    default:
      return {
        id: field.id,
        type: "short-answer",
        title: field.title,
        description: "",
        responses: 0,
        data: [],
      };
  }
};

// Render chart based on card type
const renderChart = (card: CardConfig) => {
  switch (card.type) {
    case "pie":
      return (
        <>
          <ChartContainer config={chartConfig} >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={card.data as PieChartData[]}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ value }) => `${value}%`}
                  labelLine={false}
                >
                  <LabelList
                    dataKey="name"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: ReactNode) =>
                      chartConfig[value as keyof typeof chartConfig]?.label || value
                    }
                  />
                  {(card.data as PieChartData[]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
            {(card.data as PieChartData[]).map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <span className="text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </>
      );
    case "horizontal-bar":
      return (
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={card.data as HorizontalBarData[]}
            layout="vertical"
            margin={{ left: -20 }}
          >
            <XAxis type="number" dataKey="desktop" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                typeof value === "string" ? value.substring(0, 3) : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="desktop" fill="#7C3AED" radius={4} />
          </BarChart>
        </ChartContainer>
      );
    case "vertical-bar":
      return (
        <ChartContainer config={chartConfig} className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={card.data as VerticalBarData[]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="option" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      );
    case "short-answer":
      return (
        <div className="flex flex-col">
          <h1 className="text-base text-[#464F56] font-medium py-2">
            Short answer
          </h1>
          <ScrollArea className="h-100 py-1 rounded-md border">
            {(card.data as string[]).map((tag, index) => (
              <Fragment key={index}>
                <div className="text-sm px-2">{tag}</div>
                <Separator className="my-2" />
              </Fragment>
            ))}
          </ScrollArea>
        </div>
      );
    default:
      return null;
  }
};

export function SummaryView() {
  const { id } = useParams();
  const { data: formDetails } = useGetApiV1FormsId(String(id), {
    query: {
      enabled: !!id,
    },
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      {formDetails?.fields?.map((field) => <FieldCard key={field._id} field={field} formId={String(id)} />)}
    </div>
  );
}