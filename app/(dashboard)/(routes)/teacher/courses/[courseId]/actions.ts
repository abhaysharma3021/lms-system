"use server";

import * as z from "zod";
import {
  descriptionSchema,
  titleSchema,
  imageSchema,
  categorySchema,
  priceSchema,
  attachmentSchema,
  chapterSchema,
} from "./schema";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function updateTitle(
  values: z.infer<typeof titleSchema>,
  id: string
) {
  const validateFields = titleSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const course = await db.course.update({
      where: {
        id,
        userId,
      },
      data: {
        ...validateFields.data,
      },
    });

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Course updated!" };
  } catch (error: any) {
    return { error: "Something went wrong!" };
  }
}

export async function updateDescription(
  values: z.infer<typeof descriptionSchema>,
  id: string
) {
  const validateFields = descriptionSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const course = await db.course.update({
      where: {
        id,
        userId,
      },
      data: {
        ...validateFields.data,
      },
    });

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Course updated!" };
  } catch (error: any) {
    return { error: "Something went wrong!" };
  }
}
export async function updateImage(
  values: z.infer<typeof imageSchema>,
  id: string
) {
  const validateFields = imageSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const course = await db.course.update({
      where: {
        id,
        userId,
      },
      data: {
        ...validateFields.data,
      },
    });

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Course updated!" };
  } catch (error: any) {
    return { error: "Something went wrong!" };
  }
}

export async function updateCategory(
  values: z.infer<typeof categorySchema>,
  id: string
) {
  const validateFields = categorySchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const course = await db.course.update({
      where: {
        id,
        userId,
      },
      data: {
        ...validateFields.data,
      },
    });

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Course updated!" };
  } catch (error: any) {
    return { error: "Something went wrong!" };
  }
}

export async function updatePrice(
  values: z.infer<typeof priceSchema>,
  id: string
) {
  const validateFields = priceSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const course = await db.course.update({
      where: {
        id,
        userId,
      },
      data: {
        ...validateFields.data,
      },
    });

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Course updated!" };
  } catch (error: any) {
    return { error: "Something went wrong!" };
  }
}

export async function createAttachment(
  values: z.infer<typeof attachmentSchema>,
  id: string
) {
  const validateFields = attachmentSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const { url } = validateFields.data;

    const courseOwner = await db.course.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop() as string,
        courseId: id,
      },
    });

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Attachment created!" };
  } catch (error: any) {
    return { error: "Something went wrong!" };
  }
}

export async function deleteAttachment(id: string, attachmentId: string) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    const attachment = await db.attachment.delete({
      where: {
        id: attachmentId,
      },
    });

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Attachment deleted!" };
  } catch (error: any) {
    return { error: "Something went wrong!" };
  }
}

export async function createChapter(
  values: z.infer<typeof chapterSchema>,
  id: string
) {
  const validateFields = chapterSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields!" };
  }
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }

    const { title } = validateFields.data;

    const courseOwner = await db.course.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!courseOwner) {
      return { error: "Unauthorized" };
    }

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: id,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        title,
        courseId: id,
        position: newPosition,
      },
    });

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Chapter created!" };
  } catch (error: any) {
    return { error: "Something went wrong!" };
  }
}

export async function reorderChapter(
  updateData: { id: string; position: number }[],
  id: string
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { error: "Unauthorized" };
    }
    const ownCourse = await db.course.findUnique({
      where: {
        id,
        userId,
      },
    });
    if (!ownCourse) {
      return { error: "Unauthorized" };
    }

    for (let item of updateData) {
      await db.chapter.update({
        where: { id: item.id },
        data: {
          position: item.position + 1,
        },
      });
    }

    revalidatePath(`/teacher/courses/${id}`);
    return { success: "Course reordered" };
  } catch (error) {
    return { error: "Something went wrong!" };
  }
}
