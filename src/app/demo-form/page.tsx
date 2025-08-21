"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Human Resources", value: 28, color: "#6B46C1" },
  { name: "Marketing", value: 25, color: "#7C3AED" },
  { name: "Development", value: 22, color: "#8B5CF6" },
  { name: "Sales", value: 15, color: "#A78BFA" },
  { name: "Customer Support", value: 10, color: "#C4B5FD" },
]

const chartConfig = {
  humanResources: {
    label: "Human Resources",
    color: "#6B46C1",
  },
  marketing: {
    label: "Marketing",
    color: "#7C3AED",
  },
  development: {
    label: "Development",
    color: "#8B5CF6",
  },
  sales: {
    label: "Sales",
    color: "#A78BFA",
  },
  customerSupport: {
    label: "Customer Support",
    color: "#C4B5FD",
  },
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="font-medium text-sm"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function Component() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Department Distribution</CardTitle>
          <CardDescription>Breakdown by department percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "14px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
