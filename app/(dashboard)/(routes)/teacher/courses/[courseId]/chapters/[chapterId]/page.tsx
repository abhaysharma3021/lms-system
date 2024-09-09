import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ChapterEditPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.chapterId,
    },
    include: {
      muxData: true,
    },
  });

  return (
    <div>
      {params.chapterId} - {params.courseId}
    </div>
  );
};

export default ChapterEditPage;
