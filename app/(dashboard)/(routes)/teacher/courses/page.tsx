import { Button } from "@/components/ui/button";
import Link from "next/link";

const TeacherCoursesPage = () => {
  return (
    <div className="p-6">
      <Button asChild>
        <Link href="/teacher/courses/create">New Course</Link>
      </Button>
    </div>
  );
};

export default TeacherCoursesPage;
