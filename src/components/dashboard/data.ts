import { CardItem } from "@/types/dashboard/analytics";
import { FormData, OrganizationMemberData } from "@/types/dashboard/simple-table";
import { MdOutlineArticle } from "react-icons/md";
import { MdOutlineGroup } from "react-icons/md";
import { MdAvTimer } from "react-icons/md";

const cardsData: CardItem[] = [
    {
        label: "Total forms",
        value: 24,
        percentage: "35%",
        icon: MdOutlineArticle,
    },
    {
        label: "Total Responses",
        value: "5,786",
        percentage: "35%",
        icon: MdOutlineGroup,
    },
    {
        label: "Avg. Completions Rate (Private)",
        value: "45%",
        percentage: "35%",
        icon: MdAvTimer,
    },
]

const formData: FormData[] = [
    { id: 1, formName: "Music Student form", responses: 100, type: "Public" },
    {
      id: 2,
      formName: "Guitar Lesson Registration",
      responses: 90,
      type: "Public",
    },
    {
      id: 3,
      formName: "Piano Course Enrollment",
      responses: 123,
      type: "Private",
    },
    { id: 4, formName: "Drum Workshop Signup", responses: 124, type: "Public" },
    {
      id: 5,
      formName: "Violin Class Application",
      responses: 125,
      type: "Private",
    },
    { id: 6, formName: "Singing Audition Form", responses: 126, type: "Public" },
    {
      id: 7,
      formName: "Music Theory Assessment",
      responses: 127,
      type: "Private",
    },
    {
      id: 8,
      formName: "Band Membership Registration",
      responses: 128,
      type: "Public",
    },
    {
      id: 9,
      formName: "Orchestra Participation Form",
      responses: 129,
      type: "Private",
    },
    {
      id: 10,
      formName: "Sound Engineering Course",
      responses: 130,
      type: "Public",
    },
    {
      id: 11,
      formName: "Music Production Workshop",
      responses: 131,
      type: "Private",
    },
    {
      id: 12,
      formName: "Composition and Arranging Class",
      responses: 132,
      type: "Public",
    },
    {
      id: 13,
      formName: "Music History Seminar",
      responses: 133,
      type: "Private",
    },
    {
      id: 14,
      formName: "Jazz Improvisation Workshop",
      responses: 134,
      type: "Public",
    },
  ];

const organizationData: OrganizationMemberData[]   = [
  { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "Member" },
  { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", role: "Member" },
  { id: 4, name: "Alice Johnson", email: "alice.johnson@example.com", role: "Member" },
  { id: 5, name: "Bob Johnson", email: "bob.johnson@example.com", role: "Member" },
  
]
export { cardsData , formData , organizationData }