"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti"
import { useGetApiV1SubmissionsOverviewCards } from "@/api/formAPI"
import { MdAvTimer, MdOutlineArticle, MdOutlineGroup } from "react-icons/md"

const AnalyticsCards = () => {
  const { data: overViewCards } = useGetApiV1SubmissionsOverviewCards({
    query: {
      select(data) {
        const card = data?.overviewCards?.map(singleCard => {
          let icon = null;

          switch (singleCard.id) {
            case "total_form": {
              icon = MdOutlineArticle
              break;
            }
            case "total_response": {
              icon = MdOutlineGroup
              break;
            }
            case "avg_completion_rate_private": {
              icon = MdAvTimer
              break;
            }
            default:
              icon = MdAvTimer
          }

          return { ...singleCard, icon }
        })

        return card
      },
    }
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
      {overViewCards?.map((card, idx) => {
        const Icon = card.icon

        // Convert percentage string like "12.5%" → number 12.5
        const percentageValue = parseFloat(card.percentage?.replace("%", "") ?? "0")


        const isPositive = !isNaN(percentageValue) && percentageValue > 0
        const isNegative = !isNaN(percentageValue) && percentageValue < 0

        const ArrowIcon = isNegative ? TiArrowSortedDown : TiArrowSortedUp
        const arrowColor = isNegative ? "text-red-600" : "text-[#056839]"

        return (
          <Card key={idx} className="bg-white py-0">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">{card.label}</p>
                <Icon className="text-2xl text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <div className={`flex items-center mt-4 ${arrowColor}`}>
                  <ArrowIcon className="text-sm mr-1" />
                  <span className="text-sm font-medium">
                    {card.percentage}
                  </span>
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
