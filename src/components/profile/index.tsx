"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Trash2, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  useGetApiV1UsersMe,
  useGetApiV1OrganizationsMe,
  usePutApiV1Users,
  usePutApiV1Organizations,
  getGetApiV1UsersMeQueryKey,
  getGetApiV1OrganizationsMeQueryKey,
} from "@/api/formAPI";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileFormData {
  username: string;
  email: string;
  role: string;
  organization: string;
  locality: string;
  profileUrl: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileComponent() {
  const { data: userData, isLoading: isUserLoading } = useGetApiV1UsersMe();
  const { data: orgData, isLoading: isOrgLoading } = useGetApiV1OrganizationsMe();
  const { mutateAsync: updateUserDetails } = usePutApiV1Users();
  const { mutateAsync: updateOrgDetails } = usePutApiV1Organizations();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch: userWatch,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      username: "",
      email: "",
      role: "super_admin",
      organization: "",
      locality: "",
      profileUrl: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Update form values when API data is loaded
  useEffect(() => {
    if (userData && orgData) {
      setValue("username", userData?.username || "");
      setValue("email", userData?.email || "");
      setValue(
        "profileUrl",
        userData?.profileUrl
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${userData?.profileUrl}`
          : ""
      );
      setValue("role", userData?.roles?.[0] || "super_admin");
      setValue("organization", orgData?.name || "");
      setValue("locality", orgData?.locality || "");
    }
  }, [userData, orgData, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Update organization details
      await updateOrgDetails(
        {
          data: {
            locality: data.locality,
            name: data.organization,
          },
        },
        {
          onSuccess: () => {
            // Invalidate organization query
            queryClient.invalidateQueries({
              queryKey: getGetApiV1OrganizationsMeQueryKey(),
            });
            // Update form with new organization data
            setValue("organization", data.organization);
            setValue("locality", data.locality);
          },
        }
      );

      // Update user details
      await updateUserDetails(
        {
          data: {
            username: data.username,
          },
        },
        {
          onSuccess: () => {
            // Invalidate user query
            queryClient.invalidateQueries({
              queryKey: getGetApiV1UsersMeQueryKey(),
            });
            // Update form with new user data
            setValue("username", data.username);
          },
        }
      );

      console.log("Profile updated:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    console.log("Password update:", data);
    setIsPasswordModalOpen(false);
    resetPassword();
    // Add your API call to update password here
  };

  if (isUserLoading || isOrgLoading) {
    return <div>Loading...</div>;
  }

  if (!userData || !orgData) {
    return <div>Error: Unable to load profile data</div>;
  }

  const profileUrl = userWatch("profileUrl");

  return (
    <div className="p-6 min-h-screen rounded-lg bg-white">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 col-span-full">
        Profile
      </h1>

      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-1">
          <div className="flex justify-center items-center">
            <div className="space-y-4">
              <div className="border-2 border-dashed p-4">
                <div className="flex justify-end items-center">
                  <Button variant="ghost" size="icon" className="size-8">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
                <Avatar className="w-48 h-48 bg-gray-100 border-2">
                  <AvatarImage src={profileUrl ? profileUrl : "/placeholder.svg"} />
                  <AvatarFallback className="bg-gray-200">
                    <User className="w-20 h-20 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex justify-center items-center">
                <Dialog
                  open={isPasswordModalOpen}
                  onOpenChange={setIsPasswordModalOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2">
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader className="flex flex-row items-center justify-between">
                      <DialogTitle className="text-xl font-medium text-gray-700">
                        Update Password
                      </DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                      className="space-y-4 py-4"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentPassword"
                          className="text-sm font-medium text-gray-700"
                        >
                          Previous password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          placeholder="Existing Password"
                          {...registerPassword("currentPassword", {
                            required: "Current password is required",
                          })}
                          className="w-full"
                        />
                        {passwordErrors.currentPassword && (
                          <p className="text-red-500 text-sm">
                            {passwordErrors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          New Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="Enter New Password"
                          {...registerPassword("newPassword", {
                            required: "New password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                          })}
                          className="w-full"
                        />
                        {passwordErrors.newPassword && (
                          <p className="text-red-500 text-sm">
                            {passwordErrors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Input
                          type="password"
                          placeholder="Confirm New Password"
                          {...registerPassword("confirmPassword", {
                            required: "Please confirm your new password",
                            validate: (value) =>
                              value === watch("newPassword") ||
                              "Passwords do not match",
                          })}
                          className="w-full"
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="text-red-500 text-sm">
                            {passwordErrors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-6"
                      >
                        Change Password
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                {...register("username", { required: "Username is required" })}
              />
              {profileErrors.username && (
                <p className="text-red-500 text-sm">
                  {profileErrors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                disabled
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {profileErrors.email && (
                <p className="text-red-500 text-sm">
                  {profileErrors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                disabled
                onValueChange={(value) => setValue("role", value)}
                defaultValue={userData?.roles?.[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Organization</Label>
              <Input
                {...register("organization", {
                  required: "Organization is required",
                })}
              />
              {profileErrors.organization && (
                <p className="text-red-500 text-sm">
                  {profileErrors.organization.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Locality</Label>
              <Input
                {...register("locality", { required: "Locality is required" })}
              />
              {profileErrors.locality && (
                <p className="text-red-500 text-sm">
                  {profileErrors.locality.message}
                </p>
              )}
            </div>
            <div className="flex justify-space-between gap-2 py-5">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Update Profile
              </Button>
              <Button
                type="button"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => resetProfile({
                  username: userData?.username || "",
                  email: userData?.email || "",
                  profileUrl: userData?.profileUrl
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${userData?.profileUrl}`
                    : "",
                  role: userData?.roles?.[0] || "super_admin",
                  organization: orgData?.name || "",
                  locality: orgData?.locality || "",
                })}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}