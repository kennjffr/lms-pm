import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

export default async function TeacherDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== Role.TEACHER) {
    redirect("/login");
  }

  // Fetch courses taught by this teacher
  const courses = await prisma.course.findMany({
    where: {
      teacherId: session.id,
    },
    include: {
      program: true,
      _count: {
        select: {
          materials: true,
          assignments: true,
        },
      },
    },
    orderBy: { code: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar user={session} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 font-sans">Dasbor Guru</h2>
          <p className="text-xs text-slate-500">
            Akses dan kelola mata pelajaran Anda, publikasikan materi, serta lakukan penilaian tugas siswa.
          </p>
        </div>

        {/* Courses list */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono">
            Mata Pelajaran yang Anda Ampu
          </h3>

          {courses.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-sm shadow-sm">
              Anda tidak ditugaskan ke mata pelajaran apa pun saat ini. Hubungi administrator.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-slate-50/20 transition-all duration-300 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-650 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-150">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">
                        Semester {course.semester}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {course.name}
                      </h4>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <GraduationCap size={14} className="text-blue-600" />
                      <span>{course.program.name}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4 font-medium">
                      <span>{course._count.materials} Materi</span>
                      <span>{course._count.assignments} Tugas</span>
                    </div>

                    <Link
                      href={`/dashboard/teacher/courses/${course.id}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-bold transition-all flex items-center gap-2 group/btn cursor-pointer"
                    >
                      Kelola Kelas
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
