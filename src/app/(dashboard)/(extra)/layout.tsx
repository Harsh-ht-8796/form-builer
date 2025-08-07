"use client";

import type React from "react";


export default function ExtraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-[#EFEFEF] p-4">
      {children}
    </div>
  );
}
