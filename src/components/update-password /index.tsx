"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function UpdatePasswordComponent() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 sm:items-center md:flex md:justify-end md:items-center sm:justify-center p-12">
        <div className="max-w-md">
          <Image src="/auth/login/login-side-image.svg" width={400} height={400} alt="Login illustration" className="w-full h-auto" />
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex md:items-center sm:justify-end md:justify-stretch p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Update Password</h1>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
    
              <Input
                id="password"
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>


            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium">
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
