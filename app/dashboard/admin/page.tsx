import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import Navbar from "@/components/Navbar";
import AdminDashboard from "./AdminDashboard";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== Role.ADMIN) {
    redirect("/login");
  }

  // Fetch all necessary data for the admin console
  const programs = await prisma.program.findMany({
    orderBy: { code: "asc" },
  });

  const courses = await prisma.course.findMany({
    include: {
      program: true,
      teacher: true,
    },
    orderBy: { code: "asc" },
  });

  const users = await prisma.user.findMany({
    include: {
      program: true,
    },
    orderBy: { name: "asc" },
  });

  const teachers = users.filter((u) => u.role === Role.TEACHER);
  const students = users.filter((u) => u.role === Role.STUDENT);

  // Quick stats
  const stats = {
    totalPrograms: programs.length,
    totalCourses: courses.length,
    totalTeachers: teachers.length,
    totalStudents: students.length,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar user={session} />
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Workspace Konsol Admin</h2>
          <p className="text-xs text-slate-500">
            Kelola program keahlian kejuruan digital, rancang kurikulum mata pelajaran, dan daftarkan civitas akademik.
          </p>
        </div>

        {/* Dashboard Components */}
        <AdminDashboard
          stats={stats}
          programs={programs}
          courses={courses}
          teachers={teachers}
          students={students}
        />
      </main>
    </div>
  );
}
