"use client";

import { Building2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { items } from "@/components/data";
import { useRouter } from "next/navigation";
import { usePostApiV1Forms } from "@/api/formAPI";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mutateAsync: createForm } = usePostApiV1Forms();

  const handleCreateForm = async () => {
   const formData =  await createForm({data: {}});
   router.push(`/form-builder/${formData._id}`);
  };
  return (
    <Sidebar collapsible="icon" className="border-r bg-white">
      <SidebarHeader className="bg-white p-4">
        <Button
          onClick={handleCreateForm}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
        >
          <span className="group-data-[collapsible=icon]:hidden">
            Create form
          </span>
          <span className="group-data-[collapsible=icon]:block hidden">+</span>
        </Button>
      </SidebarHeader>
      <div className="border-b" />
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname == item.url}
                    tooltip={item.title}
                    className={cn({
                      "bg-purple-100 text-purple-700 hover:bg-purple-100":
                        pathname == item.url,
                    })}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="border-b" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname == "/organization"}
                  asChild
                >
                  <Link href="/organization">
                    <Building2 />
                    <span>Organization</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
