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
import { pieChartData, verticalBarData } from "./survey-data";
import { ScrollArea } from "../ui/scroll-area";
import { Fragment, ReactNode } from "react";
import { Separator } from "../ui/separator";
const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
];
const chartConfig = {
  name: {
    label: "Visitors",
  },
  value: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;
export function SummaryView() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Top Left - Pie Chart */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Questions 1</CardTitle>
            <span className="text-sm text-gray-500">4 responses</span>
          </div>
          <p className="text-sm text-gray-500">Description</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={pieChartData}
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
                    dataKey="browser"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: ReactNode) =>
                      chartConfig[value as keyof typeof chartConfig]?.label
                    }
                  />
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-4">
            {pieChartData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <span className="text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Right - Short Answer */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#F3E8FF] p-3 rounded-sm border border-gray-200">
                <div className="space-y-0.5">
                  <div className="w-4 h-0.5 bg-purple-600 rounded-full"></div>
                  <div className="w-2 h-0.5 bg-purple-600 rounded-full"></div>
                </div>
              </div>
              <span className="text-sm text-[#6B778C] font-medium">
                Short answer
              </span>
            </div>
            <span className="text-sm text-[#6B778C] font-normal">
              4 responses
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col">
          {" "}
          {/* fixed height or use flex-grow on parent */}
          <h1 className="text-base text-[#464F56] font-medium py-2">
            Short answer
          </h1>
          <ScrollArea className="h-100 py-1 rounded-md border">
            {tags.map((tag) => (
              <Fragment key={tag}>
                <div className="text-sm px-2">{tag}</div>
                <Separator className="my-2" />
              </Fragment>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Bottom Left - Horizontal Bar Chart */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Questions 2</CardTitle>
          <p className="text-sm text-gray-500">Description</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                left: -20,
              }}
            >
              <XAxis type="number" dataKey="desktop" hide />
              <YAxis
                dataKey="month"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  console.log({ value });
                  if (typeof value === "string") {
                    return value.substring(0, 3);
                  }
                  return value;
                }}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="desktop" fill="#7C3AED"  radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bottom Right - Vertical Bar Chart */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Questions 2</CardTitle>
          <p className="text-sm text-gray-500">Description</p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={verticalBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="option" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
