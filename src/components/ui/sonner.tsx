/* -------------------------------------------------------------------------- */
/*  UI - Sonner Toaster wrapper                                               */
/* -------------------------------------------------------------------------- */
"use client"

import type React from "react"

import { Toaster as SonnerToaster } from "sonner"

/**
 * Re-export Sonner’s <Toaster /> so the rest of the app can import it from
 * "@/components/ui/sonner".
 *
 * Usage:
 *   import { Toaster } from "@/components/ui/sonner"
 *   ...
 *   <Toaster />
 */
export function Toaster(props: React.ComponentProps<typeof SonnerToaster>) {
  return <SonnerToaster richColors position="top-right" {...props} />
}
