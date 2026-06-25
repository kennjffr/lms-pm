"use client";

import { useActionState, useState } from "react";
import { createMaterialAction, createAssignmentAction, gradeSubmissionAction } from "@/app/actions";
import {
  FileText,
  FileUp,
  Download,
  Calendar,
  Award,
  Loader2,
  GraduationCap,
  ClipboardList,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface Material {
  id: number;
  title: string;
  content: string;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: Date;
}

interface Submission {
  id: number;
  content: string | null;
  fileUrl: string | null;
  fileName: string | null;
  points: number | null;
  feedback: string | null;
  status: "SUBMITTED" | "GRADED";
  createdAt: Date;
  student: {
    id: number;
    name: string;
    email: string;
  };
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  maxPoints: number;
  submissions: Submission[];
}

interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  semester: number;
  materials: Material[];
  assignments: Assignment[];
}

interface CoursePortalProps {
  course: Course;
}

export default function CoursePortal({ course }: CoursePortalProps) {
  const [activeTab, setActiveTab] = useState<"materials" | "assignments" | "submissions">("materials");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number>(
    course.assignments[0]?.id || 0
  );
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);

  // Form actions with useActionState
  const [materialState, materialFormAction, isMaterialPending] = useActionState(createMaterialAction, null);
  const [assignmentState, assignmentFormAction, isAssignmentPending] = useActionState(createAssignmentAction, null);
  const [gradingState, gradingFormAction, isGradingPending] = useActionState(gradeSubmissionAction, null);

  const activeAssignment = course.assignments.find((a) => a.id === selectedAssignmentId);

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => {
            setActiveTab("materials");
            setGradingSubmission(null);
          }}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === "materials"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
        >
          <BookOpen size={16} /> Materi Pembelajaran
        </button>
        <button
          onClick={() => {
            setActiveTab("assignments");
            setGradingSubmission(null);
          }}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === "assignments"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
        >
          <ClipboardList size={16} /> Tugas Kelas
        </button>
        <button
          onClick={() => {
            setActiveTab("submissions");
            setGradingSubmission(null);
          }}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${activeTab === "submissions"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
            }`}
        >
          <GraduationCap size={16} /> Penilaian Tugas
        </button>
      </div>

      {/* MATERIALS TAB */}
      {activeTab === "materials" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Material Form */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileUp size={16} className="text-blue-600" /> Unggah Materi Pembelajaran Baru
            </h3>
            <form action={materialFormAction} className="space-y-4">
              <input type="hidden" name="courseId" value={course.id} />

              {materialState?.error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                  {materialState.error}
                </div>
              )}
              {materialState?.success && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs">
                  {materialState.success}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Judul Materi</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Contoh: Pengantar Layout CSS Grid"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-850 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Konten Pembelajaran (Markdown)</label>
                <textarea
                  name="content"
                  required
                  rows={6}
                  placeholder="# Judul Materi&#10;Tulis penjelasan silabus atau teori..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-mono focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Unggah File Lampiran</label>
                <input
                  name="file"
                  type="file"
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold hover:file:bg-slate-200 file:transition-colors file:cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isMaterialPending}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10"
              >
                {isMaterialPending ? <Loader2 className="animate-spin" size={14} /> : "Publikasikan Materi"}
              </button>
            </form>
          </div>

          {/* Materials List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono">
              Materi yang Dipublikasikan ({course.materials.length})
            </h3>
            {course.materials.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs shadow-sm">
                Belum ada materi pembelajaran yang dipublikasikan di kelas ini.
              </div>
            ) : (
              <div className="space-y-4">
                {course.materials.map((material) => (
                  <div key={material.id} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300/30 transition-all space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-slate-800 text-md flex items-center gap-2">
                        <FileText size={16} className="text-blue-650" /> {material.title}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(material.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Markdown Body Preview */}
                    <div className="text-xs text-slate-600 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-150">
                      {material.content}
                    </div>

                    {material.fileUrl && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <span className="text-slate-600 font-medium truncate max-w-[250px]">
                          📎 {material.fileName || "attachment"}
                        </span>
                        <a
                          href={`/api/download?file=${encodeURIComponent(material.fileUrl)}&name=${encodeURIComponent(material.fileName || "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all flex items-center gap-1.5 font-medium cursor-pointer"
                        >
                          <Download size={12} /> Unduh Lampiran
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ASSIGNMENTS TAB */}
      {activeTab === "assignments" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Assignment Form */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 h-fit">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <ClipboardList size={16} className="text-blue-600" /> Buat Tugas Baru
            </h3>
            <form action={assignmentFormAction} className="space-y-4">
              <input type="hidden" name="courseId" value={course.id} />

              {assignmentState?.error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                  {assignmentState.error}
                </div>
              )}
              {assignmentState?.success && (
                <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs">
                  {assignmentState.success}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Judul Tugas</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="Contoh: Rancang Portofolio HTML/CSS"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-850 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Petunjuk Tugas</label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  placeholder="Instruksi, ketentuan pengerjaan, dan format penilaian..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Tenggat Waktu</label>
                  <input
                    name="dueDate"
                    type="datetime-local"
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600">Poin Maksimal</label>
                  <input
                    name="maxPoints"
                    type="number"
                    required
                    defaultValue={100}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-850 focus:border-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isAssignmentPending}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10"
              >
                {isAssignmentPending ? <Loader2 className="animate-spin" size={14} /> : "Terbitkan Tugas"}
              </button>
            </form>
          </div>

          {/* Assignments List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono">
              Tugas yang Diterbitkan ({course.assignments.length})
            </h3>
            {course.assignments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs shadow-sm">
                Belum ada tugas yang diterbitkan untuk kelas ini.
              </div>
            ) : (
              <div className="space-y-4">
                {course.assignments.map((assignment) => (
                  <div key={assignment.id} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300/30 transition-all space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-slate-850 text-md">
                        {assignment.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="text-blue-650 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
                          <Award size={14} /> {assignment.maxPoints} Poin
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {assignment.description}
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <Calendar size={12} />
                      <span>Batas Pengumpulan: {new Date(assignment.dueDate).toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBMISSIONS & GRADING TAB */}
      {activeTab === "submissions" && (
        <div className="space-y-6">
          {/* Selector for assignment */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <label className="text-xs font-semibold text-slate-500 font-mono uppercase">
              Pilih Tugas Kelas:
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => {
                setSelectedAssignmentId(parseInt(e.target.value));
                setGradingSubmission(null);
              }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 max-w-md transition-colors"
            >
              {course.assignments.length === 0 && <option value="0">Belum ada tugas</option>}
              {course.assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.submissions.length} Jawaban Siswa)
                </option>
              ))}
            </select>
          </div>

          {activeAssignment ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Submissions List */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                  Jawaban Hasil Kerja Siswa
                </h3>

                {activeAssignment.submissions.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs shadow-sm">
                    Belum ada siswa yang mengumpulkan jawaban tugas ini.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeAssignment.submissions.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setGradingSubmission(sub)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${gradingSubmission?.id === sub.id
                            ? "bg-blue-50 border-blue-500 shadow-blue-100/10"
                            : "bg-white border-slate-200 hover:bg-slate-50/50"
                          }`}
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-slate-800 text-sm">{sub.student.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{sub.student.email}</div>
                          <div className="text-[9px] text-slate-400 font-mono">
                            Dikirim: {new Date(sub.createdAt).toLocaleString("id-ID")}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {sub.status === "GRADED" ? (
                            <span className="px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-green-600 font-mono text-xs font-bold flex items-center gap-1">
                              Nilai: {sub.points}/{activeAssignment.maxPoints}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 font-mono text-xs font-bold">
                              Belum Dinilai
                            </span>
                          )}
                          <ChevronRight size={14} className="text-slate-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grading Console panel */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">
                  Konsol Penilaian
                </h3>

                {gradingSubmission ? (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
                    <div className="border-b border-slate-100 pb-3">
                      <div className="text-xs text-slate-400">Menilai jawaban milik:</div>
                      <div className="font-bold text-slate-850 text-md">{gradingSubmission.student.name}</div>
                    </div>

                    {/* Student notes */}
                    {gradingSubmission.content && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500">Catatan/Jawaban Siswa</label>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs text-slate-600 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto font-mono">
                          {gradingSubmission.content}
                        </div>
                      </div>
                    )}

                    {/* Submission file */}
                    {gradingSubmission.fileUrl && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-500">Lampiran Jawaban Siswa</label>
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="text-slate-600 font-medium truncate max-w-[150px]">
                            {gradingSubmission.fileName || "file_jawaban"}
                          </span>
                          <a
                            href={`/api/download?file=${encodeURIComponent(gradingSubmission.fileUrl)}&name=${encodeURIComponent(gradingSubmission.fileName || "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded bg-white hover:bg-slate-100 text-slate-700 border border-slate-250 transition-colors flex items-center gap-1 font-medium text-[11px] cursor-pointer"
                          >
                            <Download size={10} /> Unduh File
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Grade form */}
                    <form action={gradingFormAction} className="space-y-4 border-t border-slate-100 pt-4">
                      <input type="hidden" name="submissionId" value={gradingSubmission.id} />
                      <input type="hidden" name="courseId" value={course.id} />

                      {gradingState?.error && (
                        <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                          {gradingState.error}
                        </div>
                      )}
                      {gradingState?.success && (
                        <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs">
                          {gradingState.success}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="text-[11px] font-semibold text-slate-600">Berikan Nilai</label>
                          <span className="text-[10px] text-slate-400 font-mono">Maks: {activeAssignment.maxPoints} poin</span>
                        </div>
                        <input
                          name="points"
                          type="number"
                          required
                          max={activeAssignment.maxPoints}
                          defaultValue={gradingSubmission.points ?? ""}
                          placeholder="Contoh: 90"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-600">Umpan Balik / Catatan Evaluasi Guru</label>
                        <textarea
                          name="feedback"
                          rows={4}
                          defaultValue={gradingSubmission.feedback ?? ""}
                          placeholder="Masukkan ulasan atau instruksi perbaikan..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isGradingPending}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10"
                      >
                        {isGradingPending ? <Loader2 className="animate-spin" size={14} /> : "Simpan Penilaian"}
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs shadow-sm">
                    Pilih salah satu hasil pengumpulan siswa di daftar sebelah kiri untuk menampilkan detail jawaban dan melakukan penilaian.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-sm shadow-sm">
              Silakan buat dan terbitkan tugas terlebih dahulu sebelum melacak pengumpulan jawaban siswa.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
