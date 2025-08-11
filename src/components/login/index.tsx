/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: async () => {
      return {
        email: "v7@yopmail.com",
        password: "Test@123",
      };
    },
  });

  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const onSubmit = async (data: any) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      // callbackUrl: "/dashboard",
    });

    if (!result?.error) {
      router.replace("/dashboard");
    }

    setError(String(result?.error));
    console.log("Login result:", result);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column */}
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

      {/* Right Column */}
      <div className="w-full lg:w-1/2 flex md:items-center sm:justify-end md:justify-stretch p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Login</h1>
          </div>

          {/* Display error message if error=CredentialsSignin */}
          {error === "CredentialsSignin" && (
            <div className="text-red-600 text-sm text-center">
              Invalid email or password. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email", { required: true })}
              />
            </div>

            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password", { required: true })}
              />
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Log in
            </Button>

            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">OR</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-medium flex items-center justify-center gap-2 bg-transparent"
            >
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                {/* Paths */}
              </svg>
              Sign in with Google
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              {"Don't have an account? "}
              <Link
                href="/auth1/signup"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign up now
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
