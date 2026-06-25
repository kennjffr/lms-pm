"use client";

import { useActionState, useState } from "react";
import { createProgramAction, createCourseAction, createUserAction } from "@/app/actions";
import {
  FolderKanban,
  GraduationCap,
  Layers,
  Users,
  Plus,
  NotebookTabs,
  Loader2,
} from "lucide-react";

interface AdminDashboardProps {
  stats: {
    totalPrograms: number;
    totalCourses: number;
    totalTeachers: number;
    totalStudents: number;
  };
  programs: Array<{ id: number; name: string; code: string; description: string }>;
  courses: Array<{
    id: number;
    name: string;
    code: string;
    description: string;
    semester: number;
    program: { name: string; code: string };
    teacher: { name: string };
  }>;
  teachers: Array<{ id: number; name: string; email: string }>;
  students: Array<{
    id: number;
    name: string;
    email: string;
    currentSemester: number | null;
    program: { name: string; code: string } | null;
  }>;
}

export default function AdminDashboard({
  stats,
  programs,
  courses,
  teachers,
  students,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"stats" | "programs" | "courses" | "users">("stats");

  // Form states using useActionState
  const [programState, programFormAction, isProgramPending] = useActionState(createProgramAction, null);
  const [courseState, courseFormAction, isCoursePending] = useActionState(createCourseAction, null);
  const [userState, userFormAction, isUserPending] = useActionState(createUserAction, null);

  const [newUserRole, setNewUserRole] = useState<string>("STUDENT");

  return (
    <div className="space-y-6">
      {/* Tabs Control */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("stats")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === "stats"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-250"
            }`}
        >
          <FolderKanban size={16} /> Ringkasan
        </button>
        <button
          onClick={() => setActiveTab("programs")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === "programs"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-250"
            }`}
        >
          <Layers size={16} /> Jurusan
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === "courses"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-250"
            }`}
        >
          <NotebookTabs size={16} /> Mata Pelajaran
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-250"
            }`}
        >
          <Users size={16} /> Pengguna
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "stats" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Layers size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-850">{stats.totalPrograms}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Jurusan</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <NotebookTabs size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-850">{stats.totalCourses}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Mapel</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-850">{stats.totalTeachers}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Guru</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <Users size={20} />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-850">{stats.totalStudents}</div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Siswa</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-tr from-white to-blue-50/20 border border-slate-250/80 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-850">Administrasi Portal Akademik SMK Digital Media</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Gunakan kontrol tab di atas untuk mengelola jurusan kejuruan (RPL, DKV, TKJ, ANIM), membuat modul kurikulum mata pelajaran, serta mendaftarkan akun guru dan siswa. Setiap akun siswa akan dipetakan ke jurusan dan semester tertentu (Semester 1 sampai 6) agar dapat menerima jadwal dan materi pembelajaran yang relevan secara otomatis.
            </p>
          </div>
        </div>
      )}

      {/* PROGRAMS TAB */}
      {activeTab === "programs" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Program Form */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Plus size={18} className="text-blue-600" /> Tambah Program Keahlian (Jurusan)
            </h3>
            <form action={programFormAction} className="space-y-4">
              {programState?.error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                  {programState.error}
                </div>
              )}
              {programState?.success && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs">
                  {programState.success}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Nama Jurusan</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: Rekayasa Perangkat Lunak"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Kode Jurusan</label>
                <input
                  name="code"
                  type="text"
                  required
                  placeholder="Contoh: RPL"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Deskripsi Jurusan</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Deskripsi target dan ruang lingkup kompetensi kejuruan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isProgramPending}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10"
              >
                {isProgramPending ? <Loader2 className="animate-spin" size={14} /> : "Tambah Jurusan"}
              </button>
            </form>
          </div>

          {/* Programs List Table */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-md font-bold text-slate-800">Daftar Program Keahlian</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Kode</th>
                    <th className="py-3 px-4">Nama Program</th>
                    <th className="py-3 px-4">Deskripsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {programs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-slate-400 text-xs">
                        Belum ada program keahlian yang terdaftar.
                      </td>
                    </tr>
                  ) : (
                    programs.map((program) => (
                      <tr key={program.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">{program.code}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{program.name}</td>
                        <td className="py-3 px-4 text-xs text-slate-500 leading-relaxed">{program.description}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* COURSES TAB */}
      {activeTab === "courses" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Course Form */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Plus size={18} className="text-blue-600" /> Rancang Mata Pelajaran Baru
            </h3>
            <form action={courseFormAction} className="space-y-4">
              {courseState?.error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                  {courseState.error}
                </div>
              )}
              {courseState?.success && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs">
                  {courseState.success}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Nama Mata Pelajaran</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: Pemrograman Web Dinamis"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Kode Mapel</label>
                <input
                  name="code"
                  type="text"
                  required
                  placeholder="Contoh: RPL-101"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Deskripsi / Silabus Singkat</label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  placeholder="Materi inti pembelajaran..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Semester</label>
                  <select
                    name="semester"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                  >
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Jurusan</label>
                  <select
                    name="programId"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Tugaskan Guru Pengampu</label>
                <select
                  name="teacherId"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isCoursePending}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10"
              >
                {isCoursePending ? <Loader2 className="animate-spin" size={14} /> : "Buat Mata Pelajaran"}
              </button>
            </form>
          </div>

          {/* Courses List Table */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-md font-bold text-slate-800">Daftar Silabus Mata Pelajaran</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Kode Mapel</th>
                    <th className="py-3 px-4">Nama Pelajaran</th>
                    <th className="py-3 px-4">Jurusan</th>
                    <th className="py-3 px-4">Sem</th>
                    <th className="py-3 px-4">Guru Pengampu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-slate-400 text-xs">
                        Belum ada mata pelajaran terdaftar.
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course.id} className="hover:bg-slate-50/50 text-xs">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">{course.code}</td>
                        <td className="py-3 px-4 font-semibold text-sm text-slate-800">{course.name}</td>
                        <td className="py-3 px-4 text-slate-500">{course.program.code}</td>
                        <td className="py-3 px-4 font-bold text-blue-600">S{course.semester}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{course.teacher.name}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create User Form */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Plus size={18} className="text-blue-600" /> Daftarkan Pengguna Baru
            </h3>
            <form action={userFormAction} className="space-y-4">
              {userState?.error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                  {userState.error}
                </div>
              )}
              {userState?.success && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs">
                  {userState.success}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Nama Lengkap</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Contoh: John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Alamat Email Resmi</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Contoh: johndoe@smk.sch.id"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Kata Sandi Default</label>
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Peran Pengguna</label>
                <select
                  name="role"
                  required
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                >
                  <option value="STUDENT">SISWA (STUDENT)</option>
                  <option value="TEACHER">GURU (TEACHER)</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              {/* Student specific fields */}
              {newUserRole === "STUDENT" && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Jurusan</label>
                    <select
                      name="programId"
                      required
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500">Semester</label>
                    <select
                      name="semester"
                      required
                      className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:border-blue-500"
                    >
                      {[1, 2, 3, 4, 5, 6].map((s) => (
                        <option key={s} value={s}>
                          Sem {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUserPending}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10"
              >
                {isUserPending ? <Loader2 className="animate-spin" size={14} /> : "Daftarkan Akun"}
              </button>
            </form>
          </div>

          {/* Members List Table */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
            {/* Teachers Sub-List */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-blue-650">Majelis Guru</h3>
              <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[9px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Nama</th>
                      <th className="py-2 px-3">Email Akun</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {teachers.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-4 text-slate-400">
                          Belum ada guru yang didaftarkan.
                        </td>
                      </tr>
                    ) : (
                      teachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{teacher.name}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono">{teacher.email}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Students Sub-List */}
            <div className="space-y-3 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-bold text-emerald-650">Daftar Siswa Aktif</h3>
              <div className="overflow-x-auto max-h-[280px] overflow-y-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[9px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Nama</th>
                      <th className="py-2 px-3">Email Akun</th>
                      <th className="py-2 px-3">Jurusan</th>
                      <th className="py-2 px-3">Sem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-slate-400">
                          Belum ada siswa yang terdaftar.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/40">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{student.name}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono">{student.email}</td>
                          <td className="py-2.5 px-3 text-slate-600">{student.program?.code || "-"}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-600">S{student.currentSemester || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
