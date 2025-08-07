export interface ResponseData {
    question: string
    answer: string
  }
  
  export interface PieChartData {
    name: string
    value: number
    fill: string
  }
  
  export interface BarChartData {
    option: string
    value: number
  }
  
  export interface QuestionData {
    option: string
    responses: number
  }
  
  export interface ChartConfig {
    value: {
      label: string
      color: string
    }
  }
  