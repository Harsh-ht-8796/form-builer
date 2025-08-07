import { FileText, Inbox, LayoutDashboard, Send } from "lucide-react";

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Received",
        url: "/received",
        icon: Inbox,
    },
    {
        title: "Sent",
        url: "/sent",
        icon: Send,
    },
    {
        title: "Draft",
        url: "/draft",
        icon: FileText,
    },
];
export { items };