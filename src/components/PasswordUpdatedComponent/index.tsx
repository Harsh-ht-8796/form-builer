"use client"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function PasswordUpdatedComponent() {
  const router = useRouter()

  const handleRedirectToLogin = () => {
    router.push("/auth/login")
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

      {/* Right Column - Success Message */}
      <div className="w-full lg:w-1/2 flex md:items-center sm:justify-end md:justify-stretch p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              Password Updated Successfully
            </h1>
            <p className="text-gray-600 mb-8">
              Your password has been updated. You can now log in with your new password.
            </p>
          </div>
          <Button
            onClick={handleRedirectToLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium"
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  )
}