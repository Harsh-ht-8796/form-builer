"use client"

import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { toast } from "sonner"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
import EmailVerification from "@/components/forgot-password"
import ResetPasswordComponent from "@/components/reset-password"

export default function EmailVerificationPage() {
  // const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  // const [loading, setLoading] = useState(false)
  // const router = useRouter()

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setLoading(true)

  //   // Simulate API call
  //   setTimeout(() => {
  //     toast.success("Login successful!")
  //     router.push("/dashboard")
  //     setLoading(false)
  //   }, 1000)
  // }

  // const handleGoogleLogin = () => {
  //   toast.info("Google OAuth integration coming soon!")
  // }

  return (
    <ResetPasswordComponent/>
  )
}
