/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton"; // Shadcn UI Skeleton
import {
  useGetApiV1UsersMe,
  useGetApiV1OrganizationsMe,
  usePutApiV1Users,
  usePutApiV1Organizations,
  getGetApiV1UsersMeQueryKey,
  getGetApiV1OrganizationsMeQueryKey,
  usePostApiV1UsersUploadImages,
  useDeleteApiV1UsersDeleteProfileImage,
  usePostApiV1UsersChangePassword,
} from "@/api/formAPI";
import { useQueryClient } from "@tanstack/react-query";
import FileUploadPopup from "../common/file-upload-popup";
import { uploadFileType } from "@/types/dashboard/components/form-builder";

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
  const { mutateAsync: uploadImages } = usePostApiV1UsersUploadImages();
  const queryClient = useQueryClient();
  const { mutateAsync: deleteProfile } = useDeleteApiV1UsersDeleteProfileImage();
  const { mutateAsync: updatePassword } = usePostApiV1UsersChangePassword();

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
        userData?.profileImage
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${userData?.profileImage}`
          : ""
      );
      setValue("role", userData?.roles?.[0] || "super_admin");
      setValue("organization", orgData?.name || "");
      setValue("locality", orgData?.locality || "");
    }
  }, [userData, orgData, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateOrgDetails(
        {
          data: {
            locality: data.locality,
            name: data.organization,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getGetApiV1OrganizationsMeQueryKey(),
            });
            setValue("organization", data.organization);
            setValue("locality", data.locality);
          },
        }
      );

      await updateUserDetails(
        {
          data: {
            username: data.username,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getGetApiV1UsersMeQueryKey(),
            });
            setValue("username", data.username);
          },
        }
      );

      console.log("Profile updated:", data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        return;
      }

      await updatePassword(
        {
          data: {
            oldPassword: data.currentPassword,
            newPassword: data.newPassword,
          },
        },
        {
          onSuccess: () => {
            setIsPasswordModalOpen(false);
            resetPassword();
            alert("Password updated successfully");
          },
          onError: (error) => {
            console.error("Error updating password:", error);
          },
        }
      );
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  const uploadFile = async (file: File, type: uploadFileType) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await uploadImages(
        {
          data: {
            profileImage: file,
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getGetApiV1UsersMeQueryKey(),
            });
          },
        }
      );

      const profileUrl = response.profileUrlUrl
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.profileUrlUrl}`
        : null;

      setValue("profileUrl", String(profileUrl));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const profileUrl = userWatch("profileUrl");

  const handleDeleteProfile = async () => {
    await deleteProfile(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetApiV1UsersMeQueryKey(),
        });
        setValue("profileUrl", "");
      },
    });
  };

  // Skeleton for the profile form and avatar
  const renderSkeleton = () => (
    <div className="p-6 min-h-screen rounded-lg bg-white">
      <Skeleton className="h-8 w-48 mb-8" />
      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-1 flex justify-center items-center">
          <div className="space-y-4">
            <div className="border-2 border-dashed p-4">
              <div className="flex justify-end items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <Skeleton className="w-48 h-48 rounded-full" />
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>
        </div>
        <div className="col-span-1 space-y-4 max-w-sm">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <div className="flex gap-2 pt-5">
            <Skeleton className="h-10 w-32 rounded-md" />
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );

  if (isUserLoading || isOrgLoading) {
    return renderSkeleton();
  }

  if (!userData || !orgData) {
    return (
      <div className="p-6 min-h-screen rounded-lg bg-white">
        Error: Unable to load profile data
      </div>
    );
  }

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
                  <FileUploadPopup
                    key="ProfileLogo"
                    type={uploadFileType.ProfileImage}
                    uploadFile={uploadFile}
                    setValue={setValue}
                    tempImageUrl="profileUrl"
                  >
                    <Button variant="ghost" size="icon" className="size-8">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </Button>
                  </FileUploadPopup>
                  <Button
                    variant="ghost"
                    onClick={handleDeleteProfile}
                    size="icon"
                    className="size-8"
                  >
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
                          Current Password
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
                        <Label
                          htmlFor="newPassword"
                          className="text-sm font-medium text-gray-700"
                        >
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="Enter New Password"
                          {...registerPassword("newPassword", {
                            required: "New password is required",
                            minLength: {
                              value: 8,
                              message: "Password must be at least 8 characters",
                            },
                            pattern: {
                              value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                              message:
                                "Password must contain at least one letter, one number, and one special character",
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
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-gray-700"
                        >
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm New Password"
                          {...registerPassword("confirmPassword", {
                            required: "Please confirm your new password",
                            validate: (value) =>
                              value === watch("newPassword") || "Passwords do not match",
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
                onClick={() =>
                  resetProfile({
                    username: userData?.username || "",
                    email: userData?.email || "",
                    profileUrl: userData?.profileImage
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${userData?.profileImage}`
                      : "",
                    role: userData?.roles?.[0] || "super_admin",
                    organization: orgData?.name || "",
                    locality: orgData?.locality || "",
                  })
                }
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