"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Fragment } from "react"
import { Separator } from "@/components/ui/separator"
import { useGetApiV1SubmissionsFormFormIdFieldFieldIdAnswers } from "@/api/formAPI"

// Define interfaces for data types
interface PieChartData {
    name: string
    value: number
    fill: string
}

interface VerticalBarData {
    option: string
    value: number
}

interface HorizontalBarData {
    month: string
    desktop: number
}

interface CardConfig {
    id: string
    title: string
    description: string
    responses: number
    type: string
    data: PieChartData[] | VerticalBarData[] | HorizontalBarData[] | string[]
}

// Colors matching the original PieChart component
const COLORS = ["#6B46C1", "#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD"]

const chartConfig = {
    value: {
        label: "Percentage",
        color: "#6B46C1",
    },
} satisfies ChartConfig

// Map field types to card config and data
const mapFieldToCardConfig = (field: any, responseData: any): CardConfig => {
    switch (field.type) {
        case "short-text":
            return {
                id: field.id,
                type: "short-answer",
                title: field.title,
                description: "Breakdown by department percentage",
                responses: responseData?.length || 0,
                data: responseData?.text_arr || [],
            }
        case "multiple-choice":
            return {
                id: field.id,
                type: "pie",
                title: field.title,
                description: "Breakdown by department percentage",
                responses: responseData?.mcq_arry?.length || 0,
                data:
                    responseData?.mcq_arry ||
                    field.options.map((option: string, index: number) => ({
                        name: option,
                        value: 0,
                        fill: COLORS[index % COLORS.length],
                    })),
            }
        default:
            return {
                id: field.id,
                type: "short-answer",
                title: field.title,
                description: "Breakdown by department percentage",
                responses: 0,
                data: [],
            }
    }
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, value }: any) => {
    // Only show labels for slices with significant percentage
    if (percent < 0.05) return null

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
            className="font-semibold text-xs drop-shadow-sm"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

const renderChart = (card: CardConfig) => {
    switch (card.type) {
        case "pie":
            return (
                <div className="w-full flex flex-col items-center">
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ top: 20, right: 20, bottom: 60, left: 20 }}>
                                <Pie
                                    data={card.data as PieChartData[]}
                                    cx="50%"
                                    cy="45%"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                    outerRadius="80%"
                                    innerRadius="0%"
                                    fill="#8884d8"
                                    dataKey="value"
                                    stroke="#ffffff"
                                    strokeWidth={2}
                                >
                                    {(card.data as PieChartData[]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                    formatter={(value: any, name: string) => [`${value}%`, name]}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={50}
                                    iconType="circle"
                                    wrapperStyle={{
                                        paddingTop: "20px",
                                        fontSize: "14px",
                                        textAlign: "center",
                                    }}
                                    layout="horizontal"
                                    align="center"
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            )
        case "long-anser":
        case "short-answer":
            return (
                <div className="flex flex-col">
                    <h1 className="text-base text-[#464F56] font-medium py-2">Short answer</h1>
                    <ScrollArea className="h-[350px] py-1 rounded-md border">
                        <div className="p-3 space-y-3">
                            {(card.data as string[]).map((response, index) => (
                                <Fragment key={index}>
                                    <div className="text-sm text-gray-700 leading-relaxed">{response}</div>
                                    {index < (card.data as string[]).length - 1 && <Separator className="my-2" />}
                                </Fragment>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )
        default:
            return null
    }
}

interface FieldCardProps {
    field: any
    formId: string
}

export function FieldCard({ field, formId }: FieldCardProps) {
    const { data: summaryOfField, isLoading } = useGetApiV1SubmissionsFormFormIdFieldFieldIdAnswers(
        String(formId),
        String(field.id),
        {
            query: {
                enabled: Boolean(formId && field.id),
                select: (data) => {
                    let shortTextarr: string[] = []

                    if (data.field.type === "short-text" || data.field.type === "long-text") {
                        shortTextarr = data?.results?.map((result: any) => result?.answer)
                        return { ...data, text_arr: shortTextarr }
                    }

                    const totalUsers = data.results.reduce((sum, r) => sum + r.users.length, 0)
                    const target = data.field.options.map((opt, i) => {
                        const result = data.results.find((r) => r.option === opt)
                        const count = result ? result.users.length : 0
                        const value = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0

                        return {
                            name: opt,
                            value,
                            fill: COLORS[i % COLORS.length],
                        }
                    })

                    return { ...data, mcq_arry: target }
                },
            },
        },
    )

    const card = mapFieldToCardConfig(field, summaryOfField)

    return (
        <Card key={card.id} className="border border-gray-200 shadow-sm">
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
                        <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                    </div>
                    {card.responses > 0 && <span className="text-sm text-[#6B778C] font-normal">{card.responses} responses</span>}
                </div>
                {card.description && <p className="text-sm text-gray-500">{card.description}</p>}
            </CardHeader>
            <CardContent className="pt-0">
                {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <div className="text-sm text-gray-500">Loading responses...</div>
                    </div>
                ) : (
                    renderChart(card)
                )}
            </CardContent>
        </Card>
    )
}
