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

// Mock data
const pieChartData = [
  { name: "Chrome", value: 40, fill: "#FF6B6B" },
  { name: "Firefox", value: 30, fill: "#4ECDC4" },
  { name: "Safari", value: 20, fill: "#45B7D1" },
  { name: "Other", value: 10, fill: "#96CEB4" },
];

const verticalBarData = [
  { option: "Option A", value: 50 },
  { option: "Option B", value: 30 },
  { option: "Option C", value: 20 },
];

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
];

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const chartConfig = {
  name: {
    label: "Visitors",
  },
  value: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

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

// Define card configuration interface with discriminated union
interface CardConfig {
  title: string;
  description: string;
  responses: number;
  type: string;
  data: PieChartData[] | VerticalBarData[] | HorizontalBarData[] | string[];
}

// Card configurations
const cardConfigs: CardConfig[] = [
  {
    type: "pie",
    title: "Questions 1",
    description: "Description",
    responses: 4,
    data: pieChartData,
  },
  {
    type: "short-answer",
    title: "Short answer",
    description: "",
    responses: 4,
    data: tags,
  },
  {
    type: "long-answer",
    title: "Long answer",
    description: "",
    responses: 4,
    data: tags,
  },
  {
    type: "horizontal-bar",
    title: "Questions 2",
    description: "Description",
    responses: 0,
    data: chartData,
  },
  {
    type: "vertical-bar",
    title: "Questions 2",
    description: "Description",
    responses: 0,
    data: verticalBarData,
  },
];

// Render chart based on card type
const renderChart = (card: CardConfig) => {
  switch (card.type) {
    case "pie":
      return (
        <>
          <ChartContainer config={chartConfig} className="h-[300px]">
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
    case "long-answer":
    case "short-answer":
      return (
        <div className="flex flex-col">
          <h1 className="text-base text-[#464F56] font-medium py-2">
            Short answer
          </h1>
          <ScrollArea className="h-100 py-1 rounded-md border">
            {(card.data as string[]).map((tag) => (
              <Fragment key={tag}>
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
  return (
    <div className="grid grid-cols-2 gap-6">
      {cardConfigs.map((card, index) => (
        <Card key={index} className="border border-gray-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {card.type === "short-answer" && (
                  <div className="bg-[#F3E8FF] p-3 rounded-sm border border-gray-200">
                    <div className="space-y-0.5">
                      <div className="w-4 h-0.5 bg-purple-600 rounded-full"></div>
                      <div className="w-2 h-0.5 bg-purple-600 rounded-full"></div>
                    </div>
                  </div>
                )}
                <CardTitle className="text-lg font-semibold">
                  {card.title}
                </CardTitle>
              </div>
              {card.responses > 0 && (
                <span className="text-sm text-[#6B778C] font-normal">
                  {card.responses} responses
                </span>
              )}
            </div>
            {card.description && (
              <p className="text-sm text-gray-500">{card.description}</p>
            )}
          </CardHeader>
          <CardContent>{renderChart(card)}</CardContent>
        </Card>
      ))}
    </div>
  );
}