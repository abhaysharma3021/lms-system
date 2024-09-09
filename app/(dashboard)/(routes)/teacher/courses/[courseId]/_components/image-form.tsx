"use client";

import * as z from "zod";
import { imageSchema } from "../schema";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle, X } from "lucide-react";

import { updateImage } from "../actions";
import Image from "next/image";
import { FileUpload } from "@/components/file-upload";
import toast from "react-hot-toast";

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof imageSchema>) => {
    startTransition(() => {
      updateImage(values, courseId)
        .then((res) => {
          if (res.success) {
            toast.success("Course updated!");
          }
          if (res.error) {
            toast.error(res.error);
          }
          toggleEdit();
        })
        .catch((error) => {
          toast.error("Something went wrong!");
        });
    });
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost" size="icon">
          {isEditing && (
            <>
              <X className="w-4 h-4" />
            </>
          )}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4" />
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.imageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
