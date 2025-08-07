import { FormFieldFieldType } from "@/api/model"
import { QuestionType } from "@/types/dashboard/components/form-builder"
import { Type, AlignLeft, CheckCircle, ChevronDown, Square } from "lucide-react"

export const questionTypes: QuestionType[] = [
  { id: "short-text", fieldType: FormFieldFieldType.text, name: "Short text", icon: Type, description: "Single line text input" },
  { id: "long-text", fieldType: FormFieldFieldType.textarea, name: "Long Text", icon: AlignLeft, description: "Multi-line text area" },
  { id: "multiple-choice", fieldType: FormFieldFieldType.radio, name: "Multiple Choice", icon: CheckCircle, description: "Radio button options" },
  { id: "dropdown", fieldType: FormFieldFieldType.select, name: "Drop down", icon: ChevronDown, description: "Dropdown selection" },
  { id: "checkbox", fieldType: FormFieldFieldType.checkbox, name: "Check Box", icon: Square, description: "Multiple selections" },
]

export const themeColors = [
  { name: "red", color: "bg-red-500" },
  { name: "orange", color: "bg-orange-500" },
  { name: "cyan", color: "bg-cyan-500" },
  { name: "yellow", color: "bg-yellow-500" },
  { name: "green", color: "bg-green-500" },
  { name: "purple", color: "bg-purple-500" },
]
