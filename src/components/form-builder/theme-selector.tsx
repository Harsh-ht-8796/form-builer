"use client"

import { themeColors } from "@/constants/question-types"


interface ThemeSelectorProps {
  selectedTheme: string
  onThemeChange: (theme: string) => void
}

export function ThemeSelector({ selectedTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-3">
        {themeColors.map((theme) => (
          <button
            key={theme.name}
            onClick={() => onThemeChange(theme.name)}
            className={`w-8 h-8 rounded-full ${theme.color} ${
              selectedTheme === theme.name ? "ring-2 ring-offset-2 ring-gray-400" : ""
            }`}
          />
        ))}
      </div>
    </div>
  )
}
