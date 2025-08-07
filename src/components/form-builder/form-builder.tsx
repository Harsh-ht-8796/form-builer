"use client";

import {  useState } from "react";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import type { Form, FormField, FormFieldType, FormRequest } from "@/api/model";
import axios from "axios";
import { token } from "@/api/constant";
import { ButtonLists } from "@/types/dashboard/components/form-builder";
import {
  usePostApiV1Forms,
  usePostApiV1FormsUploadImagesId,
} from "@/api/formAPI";
import { questionTypes } from "@/constants/question-types";
import { FormTitle } from "./form-title";
import { EmptyState } from "./empty-state";
import { QuestionCard } from "./question-card";
import { QuestionBuilder } from "./question-builder";
import { SubmitButton } from "./submit-button";
import { useRouter } from "next/navigation";
import FileUploadPopup from "../common/file-upload-popup";
import { Button } from "../ui/button";
import { FileTextIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";

type FormInputs = {
  selectedTheme: string;
  formTitle: string;
  formDescription: string;
  questions: FormField[];
  coverImageUrl?: string | null;
  logoImageUrl?: string | null;
};

export default function FormBuilder({ id }: { id: string }) {
  const { register, handleSubmit, setValue, watch, control } =
    useForm<FormInputs>({
      defaultValues: async () => {
        try {
          const { data } = await axios.get<Form>(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/forms/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const formInputs = {
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
          console.log({
            logo: !!data?.logoImage,
            cover: !!data?.coverImage,
            background: true,
          })
          setButtonLists({
            logo: !data?.logoImage,
            cover: !data?.coverImage,
            background: true,
          });
          console.log({ formInputs });
          return formInputs;
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
  const uploadFile = async (file: File, type: "coverImage" | "logoImage") => {
    console.log(type);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await uploadImages({
        id,
        data: {
          [type]: file,
        },
      });
      console.log(response);

      const coverImageUrl = response.coverImageUrl
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.coverImageUrl}`
        : null;

      const logoImageUrl = response.logoImageUrl
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.logoImageUrl}`
        : null;

      const imageUrl = type === "coverImage" ? coverImageUrl : logoImageUrl;

      console.log({ imageUrl });
      setValue(
        type === "coverImage" ? "coverImageUrl" : "logoImageUrl",
        imageUrl
      );
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

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

  const { mutateAsync: addForm } = usePostApiV1Forms();
  const router = useRouter();

  const selectedTheme = watch("selectedTheme");
  const formTitle = watch("formTitle");
  const formDescription = watch("formDescription");
  const coverImageUrl = watch("coverImageUrl");
  const logoImageUrl = watch("logoImageUrl");

  const hideButtons = (key: keyof ButtonLists) => {
    setButtonLists((prev) => ({ ...prev, [key]: !prev[key] }));
    if (key === "logo") {
      setValue("logoImageUrl", null);
    }
    if (key === "cover") {
      setValue("coverImageUrl", null);
    }
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
    if (!draggedQuestion) {
      setDraggedQuestion(null);
      return;
    }
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
    const response = await addForm({
      data: formData,
    });
    router.push(`/`);
    console.log("Form JSON:", JSON.stringify(response, null, 2));
  };

  const handleChangeCover = () => {
    console.log("Clicked on cover");
  };

  return (
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
            <FileUploadPopup
              key="Cover"
              uploadFile={uploadFile}
              type="coverImage"
              setValue={setValue}
              onRemove={() => hideButtons("cover")}
            >
              <Button
                onClick={handleChangeCover}
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
            <FileUploadPopup
              key="Logo"
              type="logoImage"
              uploadFile={uploadFile}
              setValue={setValue}
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
                  onSubmit={handleSubmit(onSubmit)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
