"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useGetApiV1AuthVerifyOtp, usePostApiV1AuthSetPassword } from "@/api/formAPI";

interface FormData {
  password: string;
  confirmPassword: string;
}

export default function OtpPasswordUpdate() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  const { data: otpResponse } = useGetApiV1AuthVerifyOtp({ email, otp }, {
    query: {
      enabled: !!email && !!otp,
    }
  })

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: setUserPassword } = usePostApiV1AuthSetPassword()
  const password = watch("password");

  useEffect(() => {
    if (!email || !otp) {
      router.push("/auth/login");
    }
  }, [email, otp, router]);

  const handleUpdatePassword = async (data: FormData) => {
    setError("");
    setSuccess("");

    await setUserPassword({
      data:
      {
        email,
        otp,
        newPassword: data.password,
        accessToken: String(otpResponse?.accessToken)
      },
    }, {
      onSuccess: (data) => {
        setSuccess(String(data?.message));
        router.push("/auth/login");
      },
      onError(error, variables, context) {
        console.log({ error, variables, context })
        const err = error as { message: string };
        setError(err?.message || "Something went wrong");
      },
    });

  };

  if (!email || !otp) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
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

      <div className="w-full lg:w-1/2 flex md:items-center sm:justify-end md:justify-stretch p-8">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Update Password</h1>
          </div>

          <form onSubmit={handleSubmit(handleUpdatePassword)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Password cannot exceed 50 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/,
                    message:
                      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                  validate: {
                    noWhitespace: (value) =>
                      !/\s/.test(value) || "Password cannot contain whitespace",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) => value === password || "Passwords do not match",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}