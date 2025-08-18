"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Question } from "@/types/dashboard/components/form-builder";
import { useGetApiV1FormsIdUserView, usePostApiV1SubmissionsFormFormId } from "@/api/formAPI";
import { FormField as FormFieldType } from "@/api/model";
import { useParams } from "next/navigation";

type FormData = {
  [key: string]: any;
};

export default function DynamicForm() {

  const { id } = useParams()
  const { data: dynamicForm } = useGetApiV1FormsIdUserView(String(id), {
    query: {
      enabled: !!id
    }
  })

  const { mutateAsync: submitUserForm } = usePostApiV1SubmissionsFormFormId()

  const form = useForm<FormData>({
    defaultValues: async () => {
      const response = await fetch("/api/question/1");
      const data = await response.json();
      console.log(data);
      const setDefaultValues: Record<string, any> = {};
      data.questions.forEach((question: Question) => {
        if (question.type === "checkbox") {
          setDefaultValues[question.id] = [];
        } else {
          setDefaultValues[question.id] = "";
        }
      });
      return setDefaultValues;
    },

    // defaultValues: {
    //     [formData.questions[0].id]: "",
    //     [formData.questions[1].id]: "",
    //     [formData.questions[2].id]: "",
    //     [formData.questions[3].id]: "",
    //     [formData.questions[4].id]: [],
    //   },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // console.log("Form submitted:", data);
      // console.log("Form submitted:", String(dynamicForm?._id));
      const response = await submitUserForm({
        formId: String(id),
        data: {
          data: {
            ...data
          }
        }
      })
      // Handle successful submission here
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const getValidationRules = (question: FormFieldType) => {
    const rules: any = {};

    if (question.required) {
      if (question.type === "checkbox") {
        rules.validate = (value: string[]) =>
          (value && value.length > 0) || "Please select at least one option";
      } else {
        rules.required = "This field is required";
      }
    }

    if (question.type === "short-text") {
      rules.minLength = {
        value: 2,
        message: "Name must be at least 2 characters",
      };
    }

    return rules;
  };

  const renderQuestion = (question: FormFieldType) => {
    const { id, type, title, options, required } = question;
    const validationRules = getValidationRules(question);
    switch (type) {
      case "short-text":
        return (
          <FormField
            key={id}
            control={control}
            name={String(id)}
            rules={validationRules}
            render={({ field }) => (
              <FormItem className="space-y-2 sm:space-y-3">
                <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                  {title} {required && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 h-10 sm:h-11 text-sm sm:text-base"
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        );

      case "long-text":
        return (
          <FormField
            key={id}
            control={control}
            name={String(id)}
            rules={validationRules}
            render={({ field }) => (
              <FormItem className="space-y-2 sm:space-y-3">
                <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                  {title} {required && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <Textarea
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    className="border-gray-300 focus:border-gray-400 focus:ring-gray-400 min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
                    placeholder=""
                  />
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        );

      case "multiple-choice":
        return (
          <FormField
            key={id}
            control={control}
            name={String(id)}
            rules={validationRules}
            render={({ field }) => (
              <FormItem className="space-y-3 sm:space-y-4">
                <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                  {title} {required && <span className="text-red-500">*</span>}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-2 sm:space-y-3"
                  >
                    {options?.map((option: string, index: number) => (
                      <div
                        key={option}
                        className="flex items-center space-x-2 sm:space-x-3"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded border-2 border-gray-400 bg-[#EFEFEF] flex items-center justify-center text-xs sm:text-sm font-medium text-gray-700 flex-shrink-0">
                            {String.fromCharCode(65 + index)}
                          </div>
                          <RadioGroupItem
                            value={option}
                            id={`${id}-${option}`}
                            className="border-gray-400 w-4 h-4 sm:w-5 sm:h-5"
                          />
                          <Label
                            htmlFor={`${id}-${option}`}
                            className="text-sm sm:text-base font-normal text-gray-700 cursor-pointer leading-tight"
                          >
                            {option}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        );

      case "dropdown":
        return (
          <FormField
            key={id}
            control={control}
            name={String(id)}
            rules={validationRules}
            render={({ field }) => (
              <FormItem className="space-y-2 sm:space-y-3">
                <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                  {title} {required && <span className="text-red-500">*</span>}
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="min-w-xs border-gray-300 focus:border-gray-400 focus:ring-gray-400 h-10 sm:h-11 text-sm sm:text-base">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options?.map((option: string) => (
                      <SelectItem
                        key={option}
                        value={option}
                        className="text-sm sm:text-base"
                      >
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        );

      case "checkbox":
        return (
          <FormField
            key={id}
            control={control}
            name={String(id)}
            rules={validationRules}
            render={({ field }) => (
              <FormItem className="space-y-3 sm:space-y-4">
                <FormLabel className="text-sm sm:text-base font-medium text-gray-700">
                  {title} {required && <span className="text-red-500">*</span>}
                </FormLabel>
                <div className="space-y-2 sm:space-y-3">
                  {options?.map((option: string) => (
                    <FormField
                      key={option}
                      control={control}
                      name={String(id)}
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option}
                            className="flex flex-row items-center space-x-2 sm:space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option)}
                                onCheckedChange={(checked) => {
                                  const updatedValue = field.value || [];
                                  if (checked) {
                                    field.onChange([...updatedValue, option]);
                                  } else {
                                    field.onChange(
                                      updatedValue.filter(
                                        (value: string) => value !== option
                                      )
                                    );
                                  }
                                }}
                                className="border-gray-400 data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600 w-4 h-4 sm:w-5 sm:h-5"
                              />
                            </FormControl>
                            <FormLabel className="text-sm sm:text-base font-normal text-gray-700 cursor-pointer leading-tight">
                              {option}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage className="text-xs sm:text-sm" />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  const sortedQuestions = dynamicForm?.fields?.sort((a, b) => Number(a?.order) - Number(b?.order));

  return (
    <div className="min-h-screen bg-white">
      {/* Header with yellow background and pencils - Responsive */}
      <div className="relative h-24 sm:h-32 md:h-40 bg-gradient-to-r from-yellow-400 to-yellow-500 overflow-hidden" />

      {/* Form Content - Responsive Container */}
      <div className="w-full relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16">

        <div className="-mt-12 sm:-mt-16 flex justify-start">
          <Avatar className="size-24 sm:size-28 border-4 border-white shadow-md">
            <AvatarImage src={
              dynamicForm?.logoImage
                ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${dynamicForm.logoImage}`
                : "/placeholder.svg"
            } />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </div>
        {/* Form Title - Aligned with form inputs */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 text-left">
            {dynamicForm?.title}
          </h1>
        </div>

        {/* Form - Responsive Card */}
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 sm:space-y-8"
              >
                {sortedQuestions?.map(renderQuestion)}

                {/* Submit Button - Responsive */}
                <div className="pt-6 sm:pt-8">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto bg-black hover:bg-gray-800 disabled:opacity-50 text-white px-6 sm:px-8 py-3 sm:py-3 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base font-medium min-h-[44px] touch-manipulation"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
