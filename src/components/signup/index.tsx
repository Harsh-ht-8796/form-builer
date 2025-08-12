/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePostApiV1AuthRegister } from "@/api/formAPI";
import { usePostApiV1OrganizationsMapToUser } from "@/api/custom-org";
import { removeToken, setToken } from "@/lib/tokenUtils";
type FormState = "signup" | "createOrganization";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface OrganizationFormData {
  organizationName: string;
  local: string;
}

export default function AuthComponent() {
  const [formState, setFormState] = useState<FormState>("signup");
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { mutateAsync: registerUser } = usePostApiV1AuthRegister()
  const { mutateAsync: mapOrgnization } = usePostApiV1OrganizationsMapToUser();

  // Sign-up form
  const signupForm = useForm<SignUpFormData>({
    defaultValues: {
      name: "v7@yopmail.com",
      email: "v7@yopmail.com",
      password: "Test@123",
      confirmPassword: "Test@123",
    },
  });



  // Organization form
  const organizationForm = useForm<OrganizationFormData>({
    defaultValues: {
      organizationName: "",
      local: "",
    },
  });

  const onSignUpSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call (uncomment and adjust for actual API integration)
      const result = await registerUser({
        data: {
          username: data.name,
          email: data.email,
          password: data.password,
          roles: ["super_admin"],
        },
      });

      setToken(String(result?.tokens?.access?.token));
      console.log("Registration result:", result);
      alert("Registration successful!");
      setFormState("createOrganization");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "An error occurred during registration";
      setError(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onOrganizationSubmit = async (data: OrganizationFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate organization creation API call

      await mapOrgnization({
        data: {
          name: data.organizationName,
          locality: data.local,
        },
      },);
      removeToken()
      alert("Organization created successfully!");
      router.replace("/auth/login");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "An error occurred during organization creation";
      setError(errorMessage);
      console.error("Organization creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("google", { redirect: false });
      if (!result?.error) {
        router.replace("/dashboard");
      } else {
        setError(result.error);
        console.error("Google sign-in error:", result.error);
      }
    } catch (error: any) {
      setError("An error occurred during Google sign-in");
      console.error("Google sign-in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Column - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 sm:items-center md:flex md:justify-end md:items-center sm:justify-center p-12">
        <div className="max-w-md">
          <Image
            src={formState === "signup" ? "/auth/signup/signup-side-image.svg" : "/auth/add-organization/organization-side-image.svg"}
            width={400}
            height={400}
            alt={formState === "signup" ? "Sign Up illustration" : "Create Organization illustration"}
            className="w-full h-auto"
          />
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex md:items-center sm:justify-end md:justify-stretch p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              {formState === "signup" ? "Sign Up" : "Create Organization"}
            </h1>
          </div>

          {/* Display error message */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
              {formState === "signup" && error === "Email already Taken" && (
                <span>
                  {" "}
                  <Link href="/auth/login" className="text-blue-600 hover:text-blue-800">
                    Log in instead
                  </Link>
                </span>
              )}
            </div>
          )}

          {formState === "signup" ? (
            <form
              onSubmit={signupForm.handleSubmit(onSignUpSubmit)}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-2 col-span-2">
                <Input
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  {...signupForm.register("name", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  {...signupForm.register("email", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  {...signupForm.register("password", { required: true })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  {...signupForm.register("confirmPassword", { required: true })}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="col-span-2 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium"
              >
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
              <div className="col-span-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-50 text-gray-500">OR</span>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="col-span-2 w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md font-medium flex items-center justify-center gap-2 bg-transparent"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.20-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                {isLoading ? "Signing In..." : "Sign in with Google"}
              </Button>
              <div className="col-span-2 text-center text-sm text-gray-600">
                {"Already have an account? "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Log in
                </Link>
              </div>
            </form>
          ) : (
            <form
              onSubmit={organizationForm.handleSubmit(onOrganizationSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Input
                  id="organizationName"
                  type="text"
                  placeholder="Organization Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  {...organizationForm.register("organizationName", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="local"
                  type="text"
                  placeholder="Local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  {...organizationForm.register("local", { required: true })}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium"
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}