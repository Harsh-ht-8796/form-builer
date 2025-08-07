import { FormField, FormFieldFieldType, FormFieldType } from "@/api/model"

export interface Question {
    id: string
    type: string
    title: string
    order: number
    options: string[]
    required: boolean
  }
  
  export interface FormData {
    id: string
    title: string
    description: string
    questions: Question[]
    theme: string
    createdAt: string
  }
  
  export interface QuestionType {
    id: FormFieldType
    name: string
    fieldType: FormFieldFieldType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any
    description: string
  }
  


export type ButtonLists = {
    logo: boolean;
    cover: boolean;
    background: boolean;
  };