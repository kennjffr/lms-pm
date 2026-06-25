import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import CoursePortal from "./CoursePortal";

interface TeacherCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TeacherCoursePage({ params }: TeacherCoursePageProps) {
  const session = await getSession();

  if (!session || session.role !== Role.TEACHER) {
    redirect("/login");
  }

  const { id } = await params;
  const courseId = parseInt(id);

  if (isNaN(courseId)) {
    redirect("/dashboard/teacher");
  }

  // Fetch course and double check ownership
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      teacherId: session.id,
    },
    include: {
      program: true,
      materials: {
        orderBy: { createdAt: "desc" },
      },
      assignments: {
        include: {
          submissions: {
            include: {
              student: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { dueDate: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/dashboard/teacher");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-850 flex flex-col font-sans">
      <Navbar user={session} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/dashboard/teacher" className="hover:text-slate-600 transition-colors">
            Mata Pelajaran
          </Link>
          <span>/</span>
          <span className="text-slate-500">{course.code}</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-blue-650 bg-blue-50 px-2 py-0.5 rounded border border-blue-150">
              {course.code}
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">{course.name}</h2>
          </div>
          <p className="text-xs text-slate-500">
            Program Keahlian: {course.program.name} (Semester {course.semester})
          </p>
        </div>

        {/* Portal component */}
        <CoursePortal course={course} />
      </main>
    </div>
  );
}
