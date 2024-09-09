"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { chapterSchema } from "../schema";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, PlusCircle, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createChapter, reorderChapter } from "../actions";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { ChaptersList } from "./chapters-list";
import { useRouter } from "next/navigation";

interface ChaptersFormProps {
  initialData: Course & { chapters: Chapter[] };
  courseId: string;
}

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const router = useRouter();
  const [iscreating, setIsCreating] = useState(false);
  const [isUpdating, setisUpdating] = useState(false);

  const toggleCreating = () => setIsCreating((current) => !current);

  const form = useForm<z.infer<typeof chapterSchema>>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof chapterSchema>) => {
    startTransition(() => {
      createChapter(values, courseId)
        .then((res) => {
          if (res.success) {
            toast.success(res.success);
          }
          if (res.error) {
            toast.error(res.error);
          }
          toggleCreating();
        })
        .catch((error) => {
          toast.error("Something went wrong!");
        });
    });
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      startTransition(() => {
        setisUpdating(true);
        reorderChapter(updateData, courseId)
          .then((res) => {
            toast.success("Chapter reordered");
          })
          .catch((error) => {
            toast.error("Something went wrong");
          });
      });
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setisUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating ||
        (isPending && (
          <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
            <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
          </div>
        ))}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost" size="icon">
          {iscreating ? (
            <>
              <X className="w-4 h-4" />
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
      {iscreating && (
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
                      placeholder="e.g. 'Introduction to the course'"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isSubmitting || isPending}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!iscreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.chapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.chapters.length && "No chapters"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      )}
      {!iscreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
