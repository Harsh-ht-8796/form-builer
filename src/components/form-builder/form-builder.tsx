"use client";

import React, { useState, useEffect, Fragment } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import axios from "axios";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SelectSeparator } from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Bell, FileTextIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/actions/auth";
import { Form, FormField, FormFieldType, FormRequest, PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem } from "@/api/model";
import { putApiV1FormsFormIdUpdateVisibility, useGetApiV1FormsFormIdVisibility, usePostApiV1FormsUploadImagesId, usePutApiV1FormsFormIdUpdateVisibility, usePutApiV1FormsId } from "@/api/formAPI";
import { ButtonLists, uploadFileType } from "@/types/dashboard/components/form-builder";
import { FormTitle } from "./form-title";
import { EmptyState } from "./empty-state";
import { QuestionCard } from "./question-card";
import { QuestionBuilder } from "./question-builder";
import { SubmitButton } from "./submit-button";
import Image from "next/image";
import { Dialog } from "../ui/dialog";
import { questionTypes } from "@/constants/question-types";
import FileUploadPopup from "../common/file-upload-popup";

// Types
interface FormInputs {
  selectedTheme: string;
  formTitle: string;
  formDescription: string;
  questions: FormField[];
  coverImageUrl?: string | null;
  logoImageUrl?: string | null;
}

interface HeaderProps {
  pathname: string;
  session: any;
  onSaveDraft: () => void;
  onOpenSharePopup: () => void;
  onLogout: () => Promise<void>;
}

interface FormContentProps {
  buttonLists: ButtonLists;
  coverImageUrl: string | null | undefined;
  logoImageUrl: string | null | undefined;
  selectedTheme: string;
  formTitle: string;
  formDescription: string;
  fields: FormField[];
  showQuestionTypes: boolean;
  draggedQuestion: string | null;
  register: any;
  setValue: any;
  control: any;
  hideButtons: (key: keyof ButtonLists) => void;
  setShowQuestionTypes: (value: boolean) => void;
  addQuestion: (type: FormFieldType) => void;
  updateQuestion: (index: number, updates: Partial<FormField>) => void;
  deleteQuestion: (index: number) => void;
  addOption: (index: number) => void;
  updateOption: (index: number, optionIndex: number, value: string) => void;
  handleDragStart: (e: React.DragEvent, questionId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, targetIndex: number) => void;
  handleDragEnd: () => void;
  handleRequiredToggle: (index: number, checked: boolean) => void;
  duplicateQuestion: (index: number) => void;
  uploadFile: (file: File, type: uploadFileType) => Promise<void>;
}

// Header Component
const Header: React.FC<HeaderProps> = ({
  pathname,
  session,
  onSaveDraft,
  onOpenSharePopup,
  onLogout,
}) => {
  const router = useRouter();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <SelectSeparator className="mr-2 h-4" />
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">logo</h1>
          <Breadcrumb>
            <BreadcrumbList>
              {pathname
                .split("/")
                .filter(Boolean)
                .map((item, index) => (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        href={item}
                        className="text-gray-500 capitalize"
                      >
                        {item}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {index < pathname.split("/").filter(Boolean).length - 1 ? (
                      <BreadcrumbSeparator />
                    ) : null}
                  </Fragment>
                ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onSaveDraft}>
            Save As Draft
          </Button>
          <Button variant="outline">Result</Button>
          <Button variant="default" onClick={onOpenSharePopup}>
            Publish
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  className="size-8 rounded-full bg-purple-100"
                  src={
                    session?.user?.profileImage
                      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${session.user?.profileImage}`
                      : "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
                <AvatarFallback className="text-purple-700 text-center font-medium">
                  CN
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};


import { Facebook, Link, Linkedin, MessageCircle, Twitter } from "lucide-react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SharePopupProps {
  onClose: () => void;
  onPublish: (visibility: string, email?: string) => void;
}

export const SharePopup: React.FC<SharePopupProps> = ({ onClose, onPublish }) => {
  const [shareMode, setShareMode] = useState<PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem>(
    PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.public
  );

  const router = useRouter()
  const [email, setEmail] = useState("");
  const [shareToOrg, setShareToOrg] = useState(false);
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const { id } = useParams();
  const { mutateAsync: updateVisibility } = usePutApiV1FormsFormIdUpdateVisibility();
  const { data: visibilityForm } = useGetApiV1FormsFormIdVisibility(String(id), {
    query: {
      enabled: !!id,
    },
  });

  // Set state based on API data when popup opens
  useEffect(() => {
    if (visibilityForm) {
      // Set shareMode to "private" if "private" is in visibility array, else "public"
      setShareMode(
        visibilityForm.visibility?.includes(PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.private)
          ? PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.private
          : PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.public
      );
      // Set shareToOrg to true if "domain_restricted" is in visibility array
      setShareToOrg(
        visibilityForm.visibility?.includes(PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.domain_restricted) || false
      );
      // Set invitedEmails to allowedEmails from API or empty array
      setInvitedEmails(visibilityForm.allowedEmails || []);
    } else {
      // Fallback to defaults if no API data
      setShareMode(PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.public);
      setInvitedEmails([]);
      setShareToOrg(false);
    }
    setEmail("");
  }, [visibilityForm]);

  const handlePublish = () => {
    onPublish(shareMode, email || undefined);
    onClose();
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.toLowerCase());
  };

  const handleInvite = () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }
    if (!invitedEmails.includes(email)) {
      setInvitedEmails([...invitedEmails, email]);
    }
    setEmail(""); // Reset input
  };

  const handleSubmit = async () => {
    let visibility: PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem[] = [shareMode];

    if (shareToOrg && shareMode === PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.private) {
      visibility.push(PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.domain_restricted);
    }
    await updateVisibility(
      {
        formId: String(id),
        data: {
          visibility: visibility,
          ...(invitedEmails?.length ? { allowedEmails: invitedEmails } : {}),
        },
      },
      {
        onSuccess: () => {
          onClose();
          router.push("/sent")
        },
      }
    );
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="text-lg font-medium">Share</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Public/Private Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setShareMode(PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.public)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${shareMode === "public" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Public
          </button>
          <button
            onClick={() => setShareMode(PutApiV1FormsFormIdUpdateVisibilityBodyVisibilityItem.private)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${shareMode === "private" ? "bg-purple-100 text-purple-700" : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Private
          </button>
        </div>

        {shareMode === "public" ? (
          /* Public Sharing */
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-3">Share on social media</div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 h-12 bg-transparent"
              >
                <Twitter className="w-5 h-5 text-blue-400" />
                <span>Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 h-12 bg-transparent"
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>Facebook</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 h-12 bg-transparent"
              >
                <Linkedin className="w-5 h-5 text-blue-700" />
                <span>LinkedIn</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center space-x-2 h-12 bg-transparent"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span>WhatsApp</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Private Sharing */
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleInvite}
                className="text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent"
              >
                Invite
              </Button>
            </div>

            {/* Badges */}
            {invitedEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {invitedEmails.map((mail) => (
                  <div
                    key={mail}
                    className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                  >
                    <span className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center uppercase">
                      {mail.charAt(0)}
                    </span>
                    <span>{mail}</span>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shareToOrg}
                onChange={(e) => setShareToOrg(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span className="text-sm text-gray-500">Send to Organization</span>
            </label>
          </div>
        )}

        <div className="flex space-x-2">
          <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
            <Link className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Submit
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};
// Form Content Component
const FormContent: React.FC<FormContentProps> = ({
  buttonLists,
  coverImageUrl,
  logoImageUrl,
  selectedTheme,
  formTitle,
  formDescription,
  fields,
  showQuestionTypes,
  draggedQuestion,
  register,
  setValue,
  control,
  hideButtons,
  setShowQuestionTypes,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  addOption,
  updateOption,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  handleRequiredToggle,
  duplicateQuestion,
  uploadFile,
}) => {
  return (
    <div className="flex flex-1 flex-col gap-4 bg-[#EFEFEF]">
      <div className="bg-gray-100">
        {!buttonLists.cover && (
          <div className="relative h-38 bg-pink-200">
            {coverImageUrl && (
              <Image
                src={coverImageUrl}
                alt="Background"
                fill
                className="object-cover"
              />
            )}
            <div className="absolute bottom-4 right-4">
              <FileUploadPopup<FormInputs>
                key="Cover"
                uploadFile={uploadFile}
                type={uploadFileType.CoverImage}
                tempImageUrl="coverImageUrl"
                setValue={setValue}
                onRemove={() => hideButtons("cover")}
              >
                <Button
                  onClick={() => console.log("Clicked on cover")}
                  className="bg-white text-gray-800 hover:bg-gray-50"
                >
                  <FileTextIcon className="mr-2 h-4 w-4" />
                  Change Cover
                </Button>
              </FileUploadPopup>
            </div>
          </div>
        )}
        {buttonLists.cover && !buttonLists.logo && (
          <div className="relative h-32 bg-[#EFEFEF]">
            {coverImageUrl && (
              <Image
                src={coverImageUrl}
                alt="Background"
                fill
                className="object-cover"
              />
            )}
          </div>
        )}
        <div className="relative bg-[#EFEFEF] min-h-[calc(100vh-192px)] pt-16">
          {!buttonLists.logo && (
            <div className="absolute -top-16 left-4 md:left-1/4 md:-translate-x-1/2 cursor-pointer">
              <FileUploadPopup<FormInputs>
                key="Logo"
                type={uploadFileType.LogoImage}
                uploadFile={uploadFile}
                setValue={setValue}
                tempImageUrl="logoImageUrl"
                onRemove={() => hideButtons("logo")}
              >
                <Avatar className="size-28 ring-4 ring-white">
                  {logoImageUrl && <AvatarImage src={logoImageUrl} />}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </FileUploadPopup>
            </div>
          )}
          <div className="flex flex-1">
            <div className="flex-1 px-8">
              <div className="max-w-2xl mx-auto">
                <FormTitle
                  title={formTitle}
                  description={formDescription}
                  register={register}
                  setValue={setValue}
                  selectedTheme={selectedTheme}
                  buttonLists={buttonLists}
                  hideButtons={hideButtons}
                />
                {fields.length === 0 && selectedTheme && (
                  <EmptyState
                    theme={selectedTheme}
                    showQuestionTypes={showQuestionTypes}
                    onShowQuestionTypesChange={setShowQuestionTypes}
                    onAddQuestion={addQuestion}
                  />
                )}
                {fields.length > 0 && (
                  <div className="space-y-8">
                    {fields.map((question, index) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        index={index}
                        theme={selectedTheme}
                        draggedQuestion={draggedQuestion}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        onUpdateQuestion={(index, updates) =>
                          updateQuestion(index, updates)
                        }
                        onDeleteQuestion={() => deleteQuestion(index)}
                        onAddOption={() => addOption(index)}
                        onUpdateOption={(index, optionIndex, value) =>
                          updateOption(index, optionIndex, value)
                        }
                        onDuplicateQuestion={() => duplicateQuestion(index)}
                        handleRequiredToggle={(index, checked) =>
                          handleRequiredToggle(index, checked)
                        }
                      />
                    ))}
                    <QuestionBuilder
                      showQuestionTypes={showQuestionTypes}
                      onShowQuestionTypesChange={setShowQuestionTypes}
                      onAddQuestion={addQuestion}
                    />
                  </div>
                )}
                {fields.length > 0 && selectedTheme && (
                  <SubmitButton
                    theme={selectedTheme}
                    label="Submit"
                    onSubmit={() => { }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function DashboardFormBuilder({ children }: { children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { id } = useParams();

  const { register, handleSubmit, setValue, watch, control } = useForm<FormInputs>({
    defaultValues: async () => {
      try {
        const session = await getSession();
        const { data } = await axios.get<Form>(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/forms/${id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        return {
          selectedTheme: data?.settings?.backgroundColor || "cyan",
          formTitle: data?.title || "Form Title",
          formDescription: data?.description || "Form Description",
          questions: data?.fields || [],
          coverImageUrl: data?.coverImage
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.coverImage}`
            : null,
          logoImageUrl: data?.logoImage
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${data.logoImage}`
            : null,
        };
      } catch (e) {
        console.log(e);
        return {
          selectedTheme: "cyan",
          formTitle: "Form Title",
          formDescription: "Form Description",
          questions: [],
          coverImageUrl: null,
          logoImageUrl: null,
        };
      }
    },
  });

  const { mutateAsync: uploadImages } = usePostApiV1FormsUploadImagesId();
  const { mutateAsync: updateForm } = usePutApiV1FormsId();

  const { fields, append, remove, swap, update } = useFieldArray({
    control,
    name: "questions",
  });

  const [showQuestionTypes, setShowQuestionTypes] = useState(false);
  const [draggedQuestion, setDraggedQuestion] = useState<string | null>(null);
  const [buttonLists, setButtonLists] = useState<ButtonLists>({
    logo: true,
    cover: true,
    background: true,
  });
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  const selectedTheme = watch("selectedTheme");
  const formTitle = watch("formTitle");
  const formDescription = watch("formDescription");
  const coverImageUrl = watch("coverImageUrl");
  const logoImageUrl = watch("logoImageUrl");

  const uploadFile = async (file: File, type: uploadFileType) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await uploadImages({
        id: String(id),
        data: {
          [type]: file,
        },
      });
      const imageUrl =
        type === "coverImage"
          ? response.coverImageUrl
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.coverImageUrl}`
            : null
          : response.logoImageUrl
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.logoImageUrl}`
            : null;
      setValue(type === "coverImage" ? "coverImageUrl" : "logoImageUrl", imageUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const hideButtons = (key: keyof ButtonLists) => {
    setButtonLists((prev) => ({ ...prev, [key]: !prev[key] }));
    if (key === "logo") setValue("logoImageUrl", null);
    if (key === "cover") setValue("coverImageUrl", null);
  };

  const addQuestion = (type: FormFieldType) => {
    const findfieldType = questionTypes.find((q) => q.id === type);
    const newQuestion: FormField = {
      id: Date.now().toString(),
      type,
      order: fields.length + 1,
      fieldType: findfieldType?.fieldType,
      title: "Type your question here",
      options:
        type === "multiple-choice" || type === "dropdown" || type === "checkbox"
          ? ["Option 1", "Option 2", "Option 3"]
          : [],
      required: false,
    };
    append(newQuestion);
    setShowQuestionTypes(false);
  };

  const updateQuestion = (index: number, updates: Partial<FormField>) => {
    update(index, { ...fields[index], ...updates });
  };

  const deleteQuestion = (index: number) => {
    remove(index);
  };

  const addOption = (index: number) => {
    const question = fields[index];
    if (question) {
      const newOptions = [
        ...(question.options || []),
        `Option ${(question?.options?.length || 0) + 1}`,
      ];
      update(index, { ...question, options: newOptions });
    }
  };

  const updateOption = (index: number, optionIndex: number, value: string) => {
    const question = fields[index];
    if (question) {
      const newOptions = [...(question.options || [])];
      newOptions[optionIndex] = value;
      update(index, { ...question, options: newOptions });
    }
  };

  const handleDragStart = (e: React.DragEvent, questionId: string) => {
    setDraggedQuestion(questionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedQuestion) return;
    const draggedIndex = fields.findIndex((q) => q.id === draggedQuestion);
    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedQuestion(null);
      return;
    }
    swap(draggedIndex, targetIndex);
    setDraggedQuestion(null);
  };

  const handleDragEnd = () => {
    setDraggedQuestion(null);
  };

  const handleRequiredToggle = (index: number, checked: boolean) => {
    update(index, { ...fields[index], required: checked });
  };

  const duplicateQuestion = (index: number) => {
    const original = fields[index];
    const duplicated = {
      ...original,
      id: Date.now().toString(),
    };
    append(duplicated);
    swap(fields.length, index + 1);
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const formData: FormRequest = {
      title: data.formTitle,
      description: data.formDescription,
      fields: data.questions,
      settings: {
        backgroundColor: data.selectedTheme,
      },
      status: "draft",
    };
    await updateForm({
      id: String(id),
      data: formData,
    });
    router.push(`/draft`);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  const handlePublish = async (visibility: string, email?: string) => {
    console.log("called published");
  };
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header
          pathname={pathname}
          session={session}
          onSaveDraft={handleSubmit(onSubmit)}
          onOpenSharePopup={() => setIsSharePopupOpen(true)}
          onLogout={handleLogout}
        />
        <FormContent
          buttonLists={buttonLists}
          coverImageUrl={coverImageUrl}
          logoImageUrl={logoImageUrl}
          selectedTheme={selectedTheme}
          formTitle={formTitle}
          formDescription={formDescription}
          fields={fields}
          showQuestionTypes={showQuestionTypes}
          draggedQuestion={draggedQuestion}
          register={register}
          setValue={setValue}
          control={control}
          hideButtons={hideButtons}
          setShowQuestionTypes={setShowQuestionTypes}
          addQuestion={addQuestion}
          updateQuestion={updateQuestion}
          deleteQuestion={deleteQuestion}
          addOption={addOption}
          updateOption={updateOption}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          handleRequiredToggle={handleRequiredToggle}
          duplicateQuestion={duplicateQuestion}
          uploadFile={uploadFile}
        />
        <Dialog open={isSharePopupOpen} onOpenChange={setIsSharePopupOpen}>
          <SharePopup onClose={() => setIsSharePopupOpen(false)} onPublish={handlePublish} />
        </Dialog>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}