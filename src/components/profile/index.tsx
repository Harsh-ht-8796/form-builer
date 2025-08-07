"use client";

import { useState } from "react";
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

export default function ProfileComponent() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Wick",
    email: "john@example.com",
    role: "Admin",
    organization: "",
    locality: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };
  const handlePasswordSubmit = () => {
    console.log(passwordData);
    setIsPasswordModalOpen(false);
  };
  return (
    <div className="p-6  min-h-screen rounded-lg bg-white">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 col-span-full">
        Profile
      </h1>

      <div className="grid grid-cols-2 gap-8">
        <div className="col-span-1 ">
          <div className="flex justify-center items-center ">
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
                  <AvatarImage src="/placeholder.svg" />
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
                    <div className="space-y-4 py-4">
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
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            handlePasswordChange(
                              "currentPassword",
                              e.target.value
                            )
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          New Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="Enter New Password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            handlePasswordChange("newPassword", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Input
                          type="password"
                          placeholder="Confirm New Password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            handlePasswordChange(
                              "confirmPassword",
                              e.target.value
                            )
                          }
                          className="w-full"
                        />
                      </div>

                      <Button
                        onClick={handlePasswordSubmit}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-6"
                      >
                        Change Password
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="absolute top-2 right-2 flex gap-1"></div>
          </div>
        </div>
        <div className="col-span-1 ">
          <div className="space-y-4 max-w-sm">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Organization</Label>
              <Input
                value={formData.organization}
                onChange={(e) =>
                  handleInputChange("organization", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Locality</Label>
              <Input
                value={formData.locality}
                onChange={(e) => handleInputChange("locality", e.target.value)}
              />
            </div>
            <div className="flex justify-space-between gap-2 py-5">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Update Profile</Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
