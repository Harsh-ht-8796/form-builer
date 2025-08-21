import { create } from "zustand";
import { FormField, FormFieldType } from "@/api/model";
import { questionTypes } from "@/constants/question-types";
import { QuestionType } from "@/types/dashboard/components/form-builder";

interface FormState {
  questions: FormField[];
  addQuestion: (type: FormFieldType) => void;
  updateQuestion: (index: number, updates: Partial<FormField>) => void;
  deleteQuestion: (index: number) => void;
  addOption: (index: number) => void;
  updateOption: (index: number, optionIndex: number, value: string) => void;
  duplicateQuestion: (index: number) => void;
  swapQuestions: (fromIndex: number, toIndex: number) => void;
  setQuestions: (questions: FormField[]) => void;
  toggleRequired: (index: number, checked: boolean) => void;
}

export const useFormStore = create<FormState>((set) => ({
  questions: [],
  addQuestion: (type) => {
    const findFieldType = questionTypes.find((q: QuestionType) => q.id === type);
    if (!findFieldType) {
      console.error(`Question type ${type} not found`);
      return;
    }
    const newQuestion: FormField = {
      id: Date.now().toString(),
      type,
      order: 0,
      fieldType: findFieldType.fieldType,
      title: "Type your question here",
      options:
        type === "multiple-choice" || type === "dropdown" || type === "checkbox"
          ? ["Option 1", "Option 2", "Option 3"]
          : [],
      required: false,
    };
    set((state) => {
      const updatedQuestions = [...state.questions, { ...newQuestion, order: state.questions.length + 1 }];
      console.log("Added question:", updatedQuestions);
      return { questions: updatedQuestions };
    });
  },
  updateQuestion: (index, updates) =>
    set((state) => {
      const questions = [...state.questions];
      questions[index] = { ...questions[index], ...updates };
      return { questions };
    }),
  deleteQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index).map((q, i) => ({ ...q, order: i + 1 })),
    })),
  addOption: (index) =>
    set((state) => {
      const questions = [...state.questions];
      const question = questions[index];
      if (question) {
        const newOptions = [
          ...(question.options || []),
          `Option ${(question.options?.length || 0) + 1}`,
        ];
        questions[index] = { ...question, options: newOptions };
      }
      return { questions };
    }),
  updateOption: (index, optionIndex, value) =>
    set((state) => {
      const questions = [...state.questions];
      const question = questions[index];
      if (question) {
        const newOptions = [...(question.options || [])];
        newOptions[optionIndex] = value;
        questions[index] = { ...question, options: newOptions };
      }
      return { questions };
    }),
  duplicateQuestion: (index) =>
    set((state) => {
      const questions = [...state.questions];
      const original = questions[index];
      const duplicated = { ...original, id: Date.now().toString() };
      questions.splice(index + 1, 0, duplicated);
      return { questions: questions.map((q, i) => ({ ...q, order: i + 1 })) };
    }),
  swapQuestions: (fromIndex, toIndex) =>
    set((state) => {
      const questions = [...state.questions];
      [questions[fromIndex], questions[toIndex]] = [questions[toIndex], questions[fromIndex]];
      return { questions: questions.map((q, i) => ({ ...q, order: i + 1 })) };
    }),
  setQuestions: (questions) => set({ questions: questions.map((q, i) => ({ ...q, order: i + 1 })) }),
  toggleRequired: (index, checked) =>
    set((state) => {
      const questions = [...state.questions];
      questions[index] = { ...questions[index], required: checked };
      return { questions };
    }),
}));