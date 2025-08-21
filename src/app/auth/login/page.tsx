"use client";
import type React from "react"


import LoginComponent from "@/components/login"
import { Suspense } from "react";

export default function LoginPage() {
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
    <Suspense fallback={<div>Loading...</div>}>
      <LoginComponent />
    </Suspense>
  )
}
