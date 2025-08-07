"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";

export default function EmailOtpComponent() {
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

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex md:items-center sm:justify-end md:justify-stretch p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Email code </h1>
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <p className="text-gray-600 text-sm">Enter you code here</p>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium">
              Verify
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
