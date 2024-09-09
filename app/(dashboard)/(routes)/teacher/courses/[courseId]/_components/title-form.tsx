"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { titleSchema } from "../schema";
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
import { Input } from "@/components/ui/input";
import { updateTitle } from "../actions";
import toast from "react-hot-toast";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof titleSchema>>({
    resolver: zodResolver(titleSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof titleSchema>) => {
    startTransition(() => {
      updateTitle(values, courseId)
        .then((res) => {
          console.log(res);
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
        Course title
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
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}
      {isEditing && (
        <Form {...form}>
          <form
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting || isPending}
                      placeholder="e.g. 'Advance Web Development'"
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
