export const getThemeColor = (theme: string, type: "bg" | "border" | "text") => {
    const colorMap = {
      red: { bg: "bg-red-500!", border: "border-red-500!", text: "text-red-500!" },
      orange: { bg: "bg-orange-500!", border: "border-orange-500!", text: "text-orange-500!" },
      cyan: { bg: "bg-[#389DA3]!", border: "border-[#389DA3]!", text: "text-cyan-500!" },
      yellow: { bg: "bg-yellow-500!", border: "border-yellow-500!", text: "text-yellow-500!" },
      green: { bg: "bg-green-500!", border: "border-green-500!", text: "text-green-500!" },
      purple: { bg: "bg-[#7C3AED]!", border: "border-purple-500!", text: "text-purple-500!" },
    }
    return colorMap[theme as keyof typeof colorMap][type]
  }
  