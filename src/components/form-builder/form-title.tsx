"use client";

import { usePostApiV1FormsUploadImagesId } from "@/api/formAPI";
import { FormField } from "@/api/model";
import { FormHeader } from "@/components/form-builder/form-header";
import { ButtonLists } from "@/types/dashboard/components/form-builder";
import { useParams } from "next/navigation";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
type FormInputs = {
  selectedTheme: string;
  formTitle: string;
  formDescription: string;
  questions: FormField[];
};
interface FormTitleProps {
  title: string;
  description: string;
  selectedTheme: string;
  register: UseFormRegister<FormInputs>;
  setValue: UseFormSetValue<FormInputs>;
  buttonLists: ButtonLists;
  hideButtons: (key: keyof ButtonLists) => void;
}

export function FormTitle({
  title,
  description,
  selectedTheme,
  register,
  setValue,
  buttonLists,
  hideButtons,
}: FormTitleProps) {
 
  return (
    <div className="px-8 text-center">
      <div className="group">
        <FormHeader
          selectedTheme={selectedTheme}
          buttonLists={buttonLists}
          hideButtons={hideButtons}
          onThemeChange={(theme: string) => setValue("selectedTheme", theme)}
        />

        <input
          {...register("formTitle")}
          defaultValue={title}
          className="text-5xl font-normal text-slate-600 mb-4 bg-transparent border-none outline-none text-left w-full"
        />
        <textarea
          {...register("formDescription")}
          defaultValue={description}
          className="text-slate-500 text-base bg-transparent border-none outline-none text-left w-full resize-none"
          rows={2}
        />
      </div>
    </div>
  );
}