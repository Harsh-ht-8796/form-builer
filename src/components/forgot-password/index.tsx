"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { usePostApiV1AuthForgotPassword } from "@/api/formAPI"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Schema for forgot password form
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").nonempty("Email is required"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const { mutateAsync: sendForgotEmail } = usePostApiV1AuthForgotPassword()
  const router = useRouter()

  // Initialize useForm with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Form submission handler
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const response = await sendForgotEmail({
        data: {
          email: data.email.trim(),
        },
      })
      toast.success("Success", {
        description: "Password reset email sent successfully",
      })
      reset()
      // Redirect to reset password page with token
      router.push(`/auth/reset-password?token=${response.token}`)
    } catch (error: any) {
      toast.error("Error", {
        description:
          error.response?.data?.message ||
          "Failed to send password reset email. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 sm:items-center md:flex md:justify-end md:items-center sm:justify-center p-12">
        <div className="max-w-md">
          <Image
            src="/auth/login/login-side-image.svg"
            width={400}
            height={400}
            alt="Login illustration"
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Column - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex md:items-center sm:justify-end md:justify-stretch p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              Reset Password
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Email"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}