"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CloudUpload, Trash2 } from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import { UseFormSetValue } from "react-hook-form";

type FormInputs = {
  selectedTheme: string;
  formTitle: string;
  formDescription: string;
  questions: any[];
  coverImageUrl?: string | null;
  logoImageUrl?: string | null;
};

type FileUploadPopupProps = {
  children: React.ReactNode;
  onRemove?: () => void;
  setValue: UseFormSetValue<FormInputs>;
  uploadFile: (file: File, type: "coverImage" | "logoImage") => Promise<void>;
  type: "coverImage" | "logoImage";
};

export default function FileUploadPopup({
  children,
  uploadFile,
  type,
  onRemove,
  setValue,
}: FileUploadPopupProps) {
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempFile, setTempFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setTempFile(file);
      setValue(type === "coverImage" ? "coverImageUrl" : "logoImageUrl", URL.createObjectURL(file));
      uploadFile(file, type);
      setOpen(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      setTempFile(file);
      setValue(type === "coverImage" ? "coverImageUrl" : "logoImageUrl", URL.createObjectURL(file));
      uploadFile(file, type);
      setOpen(false);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[425px] p-0">
        <DialogTitle className="hidden">Dialog Title</DialogTitle>

        <div className="flex px-4 py-2">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="upload">Upload</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              {/* Upload content */}
            </TabsContent>
          </Tabs>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>

        <div className="p-6">
          <div
            className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {tempFile ? (
              <>
                <p className="text-lg font-medium text-gray-700">Selected file:</p>
                <p className="text-sm text-gray-500 mt-2">{tempFile.name}</p>
              </>
            ) : (
              <>
                <CloudUpload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700">
                  Click to choose a file or drag here
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Recommended dimensions: 200x200 pixels
                </p>
                <p className="text-sm text-gray-500">Size limit: 10 MB</p>
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}