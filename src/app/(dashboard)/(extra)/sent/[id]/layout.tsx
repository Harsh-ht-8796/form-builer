"use client"

import { SurveyHeader } from "@/components/survey-response/survey-header";




export default function SurveyResponsesLayout({ children }: { children: React.ReactNode }) {

//   const renderActiveView = () => {
//     switch (activeView) {
//       case VIEWS.INDIVIDUAL:
//         return <IndividualView />;
//       case VIEWS.QUESTION:
//         return <QuestionView />;
//       case VIEWS.SUMMARY:
//         return (
//           <SummaryView
//             pieChartData={pieChartData}
//             shortAnswers={shortAnswers}
//             horizontalBarData={horizontalBarData}
//             verticalBarData={verticalBarData}
//             chartConfig={chartConfig}
//           />
//         );
//       default:
//         return null;
//     }
//   };
  return (
    <div className="w-full min-h-full max-w-7xl mx-auto p-6 bg-white">
      <SurveyHeader />
      {children}
    </div>
  );
}