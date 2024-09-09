"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { descriptionSchema } from "../schema";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { updateDescription } from "../actions";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface DescriptionFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
}

export const DescriptionForm = ({
  initialData,
  courseId,
}: DescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof descriptionSchema>>({
    resolver: zodResolver(descriptionSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof descriptionSchema>) => {
    startTransition(() => {
      updateDescription(values, courseId)
        .then((res) => {
          if (res.success) {
            toast.success("Course Updated!");
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
        Course description
        <Button onClick={toggleEdit} variant="ghost" size="icon">
          {isEditing ? (
            <>
              <X className="w-4 h-4" />
            </>
          ) : (
            <>
              <Pencil className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-slate-500 italic"
          )}
        >
          {initialData.description || "No description"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={isSubmitting || isPending}
                      placeholder="e.g. 'This is course is about...'"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={!isValid || isSubmitting || isPending}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
