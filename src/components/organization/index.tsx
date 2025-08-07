/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { organizationData } from "@/components/dashboard/data";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/forms-table";
import { Edit2, Pencil, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdClose } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { TfiTrash } from "react-icons/tfi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLE = [
  {
    id: 1,
    value: "admin",
    label: "Admin",
  },
  {
    id: 2,
    value: "member",
    label: "Member",
  },
];

const columns = [
  {
    accessorKey: "name",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Actions",
    meta: {
      headerClassName: "text-center",
    },
    cell: () => (
      <div className="flex justify-center items-center gap-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
        <Button variant="ghost" size="icon">
          <TfiTrash className="h-4 w-4 text-gray-500" />
        </Button>
      </div>
    ),
  },
];

interface TeamMember {
 
  email: string;
  role: string
 
}

export default function Organization() {
  const filteredData = organizationData;

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addedMembers, setAddedMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Form for adding members
  const memberForm = useForm({
    defaultValues: {
      email: "",
      role: "1",
    },
  });
  const { register: registerMember, control: controlMember, reset: resetMember, getValues: getMemberValues } = memberForm;

  // Form for editing organization
  const orgForm = useForm({
    defaultValues: {
      name: "",
      locality: "",
    },
  });
  const { register: registerOrg, handleSubmit: handleOrgSubmit } = orgForm;

  // Reset member form and added members when dialog opens
  useEffect(() => {
    if (isAddMemberModalOpen) {
      resetMember({ email: "", role: "1" });
      setAddedMembers([]);
    }
  }, [isAddMemberModalOpen, resetMember]);

  // Function to add a member
  const addMember = () => {
    const currentData = getMemberValues();
    setAddedMembers([...addedMembers, currentData]);
    resetMember({ email: "", role: "" });
  };

  // Function to handle "Done" button in add member dialog
  const handleAddMemberSubmit = () => {
    console.log("Added members:", addedMembers);
    setIsAddMemberModalOpen(false);
  };

  // Function to handle organization edit form submission
  const onOrgSubmit = (data: any) => {
    console.log("Saved organization:", data);
    setIsModalOpen(false);
  };

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      {filteredData.length > 0 ? (
        <div className="min-h-screen">
          <div className="mx-auto">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Organization name
                      </h2>
                      <Button
                        size="icon"
                        onClick={() => setIsModalOpen(true)}
                        variant="outline"
                      >
                        <Edit2 />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">Locality</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <Dialog
                      open={isAddMemberModalOpen}
                      onOpenChange={setIsAddMemberModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="bg-[#7C3AED] hover:bg-[#7C3AED]/80 text-[#EFEFEF] px-6 py-2">
                          Add New Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader className="flex flex-row items-center justify-between">
                          <DialogTitle className="text-xl font-medium text-gray-700">
                            Add Member
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-2 flex flex-row gap-2">
                          <div className="flex flex-row gap-2">
                            <Input
                              placeholder="Email"
                              {...registerMember("email")}
                            />
                            <Controller
                              name="role"
                              control={controlMember}
                              render={({ field }) => (
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ROLE.map((role) => (
                                      <SelectItem
                                        key={role.id}
                                        value={role.id.toString()}
                                      >
                                        {role.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            <Button
                              onClick={addMember}
                              className="bg-[#F3E8FF] hover:bg-[#F3E8FF]/80 text-[] px-6 py-2"
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {addedMembers.map((member, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg px-1"
                            >
                              <div className="flex items-center">
                                <div className="flex flex-1 items-center min-w-6 h-6 justify-center bg-[#F3E8FF] rounded-full size-6">
                                  {member.email.at(0)}
                                </div>
                                <div className="flex-2 truncate">
                                  {member.email}
                                </div>
                                <div className="flex flex-1 justify-end">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-auto"
                                  >
                                    <MdClose className="size-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Button
                            onClick={handleAddMemberSubmit}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-6"
                          >
                            Done
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <DataTable columns={columns} data={filteredData} />
              </CardContent>
            </Card>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleOrgSubmit(onOrgSubmit)}>
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Organization
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Organization"
                      className="w-full"
                      {...registerOrg("name")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="locality"
                      className="text-sm font-medium text-gray-700"
                    >
                      Locality
                    </Label>
                    <Input
                      id="locality"
                      placeholder="Enter Locality"
                      className="w-full"
                      {...registerOrg("locality")}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-200 rounded-lg mb-6">
              <Plus className="w-8 h-8 text-purple-600" strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Add Member
            </h2>
            <p className="text-gray-500 text-base max-w-sm">
              Add member in your organization for Connectivity
            </p>
          </div>
        </div>
      )}
    </>
  );
}