"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TiArrowSortedUp } from "react-icons/ti"
import { cardsData } from "./data"


const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
      {cardsData.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card key={idx} className="bg-white py-0">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <Icon className="text-2xl text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <div className="flex items-center mt-4 text-[#056839]">
                  <TiArrowSortedUp className="text-sm mr-1" />
                  <span className="text-sm font-medium">{card.percentage}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default AnalyticsCards
