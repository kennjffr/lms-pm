import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { Role } from "@prisma/client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

export default async function StudentDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== Role.STUDENT) {
    redirect("/login");
  }

  // Fetch student's program info
  const program = session.programId
    ? await prisma.program.findUnique({ where: { id: session.programId } })
    : null;

  // Fetch courses assigned to their program and semester
  const courses = session.programId && session.currentSemester
    ? await prisma.course.findMany({
        where: {
          programId: session.programId,
          semester: session.currentSemester,
        },
        include: {
          teacher: true,
          _count: {
            select: {
              materials: true,
              assignments: true,
            },
          },
        },
        orderBy: { code: "asc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar user={session} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Student Metadata Panel */}
        {program ? (
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-white via-white to-blue-50/30 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-1">
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
                Detail Pendaftaran Siswa
              </div>
              <h2 className="text-xl font-bold text-slate-800">{program.name}</h2>
              <p className="text-xs text-slate-500 max-w-xl">{program.description}</p>
            </div>

            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-150 pt-4 sm:pt-0 sm:pl-6 shrink-0">
              <div>
                <div className="text-2xl font-extrabold text-blue-600">Semester {session.currentSemester}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Status Akademik</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center text-slate-500 text-xs shadow-sm">
            Profil Anda belum dipetakan ke program keahlian mana pun. Hubungi administrator sekolah.
          </div>
        )}

        {/* Courses list */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono">
            Mata Pelajaran Semester Ini
          </h3>

          {courses.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-sm shadow-sm">
              Tidak ada mata pelajaran yang ditemukan untuk jurusan dan semester Anda saat ini. Silakan hubungi koordinator.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-450 hover:bg-slate-50/20 transition-all duration-300 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1.5 font-sans">
                        <User size={12} className="text-blue-500" /> {course.teacher.name}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {course.name}
                      </h4>
                      <p className="text-slate-505 text-xs mt-1 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-4 font-medium">
                      <span>{course._count.materials} Materi</span>
                      <span>{course._count.assignments} Tugas</span>
                    </div>

                    <Link
                      href={`/dashboard/student/courses/${course.id}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 font-bold transition-all flex items-center gap-2 group/btn cursor-pointer"
                    >
                      Masuk Kelas
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
