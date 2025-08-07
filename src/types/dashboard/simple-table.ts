export interface FormData {
    id: number;
    formName: string;
    responses: number;
    type: "Public" | "Private";
}

export interface OrganizationMemberData {
    id: number;
    name: string;
    email: string;
    role: string;
    
}
  