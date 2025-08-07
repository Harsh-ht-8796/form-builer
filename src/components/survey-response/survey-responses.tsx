"use client"

import { useState } from "react";
import { IndividualView } from "@/components/survey-response/individual-view";
import { QuestionView } from "@/components/survey-response/question-view";
import { SummaryView } from "@/components/survey-response/summary-view";


const VIEWS = {
  INDIVIDUAL: "Individual",
  QUESTION: "Question",
  SUMMARY: "Summary",
};


export default function SurveyResponsesPage() {
  const [activeView, setActiveView] = useState(VIEWS.INDIVIDUAL);

  const renderActiveView = () => {
    switch (activeView) {
      case VIEWS.INDIVIDUAL:
        return <IndividualView />;
      case VIEWS.QUESTION:
        return <QuestionView />;
      case VIEWS.SUMMARY:
        return <SummaryView />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      {renderActiveView()}
    </div>
  );
}
