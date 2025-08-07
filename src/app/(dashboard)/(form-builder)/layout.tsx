"use client";

import type React from "react";


export default function FormBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-[#EFEFEF]">
      {children}
    </div>
  );
}
