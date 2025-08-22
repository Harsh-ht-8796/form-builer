"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Fragment } from "react"
import { Separator } from "@/components/ui/separator"
import { useGetApiV1SubmissionsFormFormIdFieldFieldIdAnswers } from "@/api/formAPI"
import { FormFieldType } from "@/api/model"

// Define interfaces for data types
interface PieChartData {
    name: string
    value: number
    fill: string
}

interface VerticalBarData {
    option: string
    value: number
    fill: string
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


const CustomTooltipContent = ({ active, payload, label }: any) => {
    console.log("[v0] Tooltip data:", { active, payload, label })

    if (active && payload && payload.length) {
        const data = payload[0]
        return (
            <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                <p className="text-sm font-medium">{label || data.payload?.name || data.payload?.option}</p>
                <p className="text-sm text-purple-600">
                    {data.name === "Responses" ? `${data.value} responses` : `${data.value}${data.payload?.name ? "%" : "%"}`}
                </p>
            </div>
        )
    }
    return null
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
    let text = "short-answer"
    if (field.type === FormFieldType["long-text"]) {
        text = "long-answer"
    }
    switch (field.type as FormFieldType) {
        case FormFieldType["long-text"]:
        case FormFieldType["short-text"]:
            return {
                id: field.id,
                type: text,
                title: field.title,
                description: "Breakdown by department percentage",
                responses: responseData?.length || 0,
                data: responseData?.text_arr || [],
            }
        case FormFieldType["multiple-choice"]:
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
        case FormFieldType.checkbox:
            console.log({ mcq_arry: responseData?.mcq_arry })
            return {
                id: field.id,
                type: "vertical-bar",
                title: field.title,
                description: "Breakdown by department percentage",
                responses: responseData?.mcq_arry?.length,
                data: responseData?.mcq_arry,
            }
        case FormFieldType.dropdown:
            return {
                id: field.id,
                type: "horizontal-bar",
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
        case "long-answer":
        case "short-answer":
            return (
                <div className="flex flex-col">
                    <h1 className="text-base text-[#464F56] font-medium py-2">{card.type==="short-answer" ? "Short Answer" :"Long Answer"}</h1>
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
        case "vertical-bar":
            return (
                <div className="w-full">
                    <ChartContainer config={chartConfig} className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={card.data as VerticalBarData[]} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis />
                                <ChartTooltip content={<CustomTooltipContent />} />
                                <Bar dataKey="value" fill="#6B46C1" radius={[4, 4, 0, 0]}>
                                    {(card.data as VerticalBarData[]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </div>
            )
        case "horizontal-bar":
            return (
                <div className="w-full">
                    <ChartContainer config={chartConfig} className="h-[400px] w-full">
                        <ResponsiveContainer
                            width={"100%"}
                            height={"100%"}
                        >
                            <BarChart
                                layout="vertical"
                                data={card.data as VerticalBarData[]}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 20,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <ChartTooltip content={<CustomTooltipContent />} />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Bar dataKey="value" fill="#6B46C1" radius={[4, 4, 0, 0]}>
                                    {(card.data as VerticalBarData[]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>

                    </ChartContainer>
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
                        shortTextarr = data?.results?.map((result: any) => result?.answer);
                        console.log({ shortTextarr })
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
