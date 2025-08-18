"use client";

import type React from "react";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { SelectSeparator } from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/auth";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const pathname = usePathname();

  const handleLogout = async () => {
    console.log("Logout====>")
    await logout();
    router.replace("/auth/login");
  };
  const { data: session, status } = useSession();


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <SelectSeparator className="mr-2 h-4" />

          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">logo</h1>

              <Breadcrumb>
                <BreadcrumbList>
                  {pathname
                    .split("/")
                    .filter(Boolean)
                    .map((item, index) => {
                      return (
                        <Fragment key={index}>
                          <BreadcrumbItem>
                            <BreadcrumbLink
                              href={item}
                              className="text-gray-500 capitalize"
                            >
                              {item}
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          {index <
                            pathname?.split("/").filter(Boolean).length - 1 ? (
                            <BreadcrumbSeparator className="" />
                          ) : null}
                        </Fragment>
                      );
                    })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  {" "}
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      className="size-8 rounded-full bg-purple-100"
                      src={session?.user?.profileImage
                        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${session.user?.profileImage}`
                        : "https://github.com/shadcn.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback className="text-purple-700 text-center font-medium">
                      CN
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 bg-[#EFEFEF]">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
