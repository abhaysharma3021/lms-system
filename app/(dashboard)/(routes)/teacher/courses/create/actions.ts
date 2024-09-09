"use server";

import * as z from "zod";
import { formSchema } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function createCourse(values: z.infer<typeof formSchema>) {
  const validateFields = formSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { title } = validateFields.data;
  const { userId } = auth();
  if (!userId) {
    return { error: "Please login to create course" };
  }

  try {
    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });
    return {
      success: "Course created successfully!",
      data: { courseId: course.id },
    };
  } catch (error: any) {
    console.log("CREATE_COURSE", error.message);
    return { error: "Something went wrong!" };
  }
}
