import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import StudentCoursePortal from "./StudentCoursePortal";

interface StudentCoursePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StudentCoursePage({ params }: StudentCoursePageProps) {
  const session = await getSession();

  if (!session || session.role !== Role.STUDENT) {
    redirect("/login");
  }

  const { id } = await params;
  const courseId = parseInt(id);

  if (isNaN(courseId)) {
    redirect("/dashboard/student");
  }

  // Fetch course and double check enrollment security
  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      programId: session.programId || undefined,
      semester: session.currentSemester || undefined,
    },
    include: {
      teacher: true,
      materials: {
        orderBy: { createdAt: "desc" },
      },
      assignments: {
        include: {
          submissions: {
            where: {
              studentId: session.id,
            },
          },
        },
        orderBy: { dueDate: "asc" },
      },
    },
  });

  if (!course) {
    redirect("/dashboard/student");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar user={session} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/dashboard/student" className="hover:text-slate-600 transition-colors">
            Mata Pelajaran
          </Link>
          <span>/</span>
          <span className="text-slate-500">{course.code}</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                {course.code}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800">{course.name}</h2>
            </div>
            <p className="text-xs text-slate-500">
              Guru: {course.teacher.name} ({course.teacher.email})
            </p>
          </div>
        </div>

        {/* Student portal tabs */}
        <StudentCoursePortal course={course} />
      </main>
    </div>
  );
}
