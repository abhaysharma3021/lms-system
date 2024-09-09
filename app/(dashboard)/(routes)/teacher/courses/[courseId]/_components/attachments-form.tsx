"use client";

import * as z from "zod";
import { attachmentSchema } from "../schema";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";

import { createAttachment, deleteAttachment } from "../actions";
import { FileUpload } from "@/components/file-upload";
import { Attachment, Course } from "@prisma/client";
import toast from "react-hot-toast";

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof attachmentSchema>) => {
    startTransition(() => {
      createAttachment(values, courseId)
        .then((res) => {
          if (res.success) {
            toast.success(res.success);
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

  const onDelete = async (id: string) => {
    startTransition(() => {
      setDeletingId(id);
      deleteAttachment(courseId, id)
        .then((res) => {
          if (res.success) {
            toast.success(res.success);
          }
          if (res.error) {
            toast.error(res.error);
          }
          setDeletingId(null);
        })
        .catch((error) => {
          toast.error("Something went wrong!");
          setDeletingId(null);
        });
    });
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course attachments
        <Button onClick={toggleEdit} variant="ghost" size="icon">
          {isEditing && (
            <>
              <X className="w-4 h-4" />
            </>
          )}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments yet
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-sm line-clamp-1">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      className="ml-auto hover:opacity-75 transition"
                      onClick={() => onDelete(attachment.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course
          </div>
        </div>
      )}
    </div>
  );
};
