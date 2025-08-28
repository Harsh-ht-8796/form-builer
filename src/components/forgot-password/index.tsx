"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { usePostApiV1AuthForgotPassword, usePostApiV1AuthResetPassword } from "@/api/formAPI"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { use, useState } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Schema for forgot password form
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address").nonempty("Email is required"),
})

// Schema for reset password form
const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").nonempty("Password is required"),
  confirmPassword: z.string().nonempty("Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: " passwords do not match",
  path: ["confirmPassword"],
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function EmailVerificationComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const { mutateAsync: sendForgotEmail } = usePostApiV1AuthForgotPassword()
  const { mutateAsync: resetPassword } = usePostApiV1AuthResetPassword()
  const router = useRouter();
  // Forgot password form
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    formState: { errors: forgotErrors },
    reset: resetForgot,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Reset password form
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
    reset: resetReset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Forgot password submission handler
  const onSubmitForgot = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      const response = await sendForgotEmail({
        data: {
          email: data.email.trim(),
        },
      })
      setToken(response.token || null)
      toast.success("Success", {
        description: "Password reset email sent successfully",
      })

      resetForgot()
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

  // Reset password submission handler
  const onSubmitReset = async (data: ResetPasswordFormData) => {
    if (!token) return
    setIsLoading(true)
    try {
      await resetPassword({
        data: {
          token,
          password: data.password,
        },
      })
      toast.success("Success", {
        description: "Password reset successfully",
      })
      router.push("/auth/login")
      setToken(null)
      resetReset()

    } catch (error: any) {
      toast.error("Error", {
        description:
          error.response?.data?.message ||
          "Failed to reset password. Please try again.",
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

      {/* Right Column - Forms */}
      <div className="w-full lg:w-1/2 flex md:items-center sm:justify-end md:justify-stretch p-8">
        {!token ? (
          // Forgot Password Form
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-8">
                Reset Password
              </h1>
            </div>
            <form onSubmit={handleSubmitForgot(onSubmitForgot)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...registerForgot("email")}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${forgotErrors.email ? "border-red-500" : ""
                    }`}
                />
                {forgotErrors.email && (
                  <p className="text-red-500 text-sm">{forgotErrors.email.message}</p>
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
        ) : (
          // Reset Password Form
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-8">
                Set New Password
              </h1>
            </div>
            <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  {...registerReset("password")}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${resetErrors.password ? "border-red-500" : ""
                    }`}
                />
                {resetErrors.password && (
                  <p className="text-red-500 text-sm">{resetErrors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  {...registerReset("confirmPassword")}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${resetErrors.confirmPassword ? "border-red-500" : ""
                    }`}
                />
                {resetErrors.confirmPassword && (
                  <p className="text-red-500 text-sm">{resetErrors.confirmPassword.message}</p>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Password"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}