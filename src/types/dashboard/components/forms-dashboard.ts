
type FormBasic =  {
    id: number
    formName: string
}
export type FormSent = FormBasic & {
    sentTo: string
    status: "Active" | "Closed"
    dateSent: string
}
export type FormDraft = FormBasic & {
    draftDate: string
}
export type FormReceived = FormBasic & {
    receivedFrom: string
    status: "Active" | "Closed"
    dateReceived: string
}
export type FormData = FormSent | FormDraft | FormReceived
export type FormTableProps = {
  formData: FormData[]
}

export interface ColumnMeta {
    headerClassName?: string;
    cellClassName?: string;
  }