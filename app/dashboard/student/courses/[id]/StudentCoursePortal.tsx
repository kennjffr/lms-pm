"use client";

import { useActionState, useState } from "react";
import { submitAssignmentAction } from "@/app/actions";
import {
  FileText,
  Download,
  Calendar,
  Award,
  Loader2,
  CheckCircle,
  FileCheck,
  ClipboardList,
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
  materials: Material[];
  assignments: Assignment[];
}

interface StudentCoursePortalProps {
  course: Course;
}

export default function StudentCoursePortal({ course }: StudentCoursePortalProps) {
  const [activeTab, setActiveTab] = useState<"materials" | "assignments">("materials");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number>(
    course.assignments[0]?.id || 0
  );
  const [isResubmitting, setIsResubmitting] = useState<boolean>(false);

  // Submission action state
  const [submitState, submitFormAction, isSubmitPending] = useActionState(submitAssignmentAction, null);

  const activeAssignment = course.assignments.find((a) => a.id === selectedAssignmentId);
  const activeSubmission = activeAssignment?.submissions[0];

  const isGraded = activeSubmission?.status === "GRADED";
  const isSubmitted = !!activeSubmission;

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => {
            setActiveTab("materials");
            setIsResubmitting(false);
          }}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "materials"
              ? "border-blue-650 text-blue-650"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
          }`}
        >
          <BookOpen size={16} /> Materi Pembelajaran
        </button>
        <button
          onClick={() => {
            setActiveTab("assignments");
            setIsResubmitting(false);
          }}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === "assignments"
              ? "border-blue-650 text-blue-650"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200"
          }`}
        >
          <ClipboardList size={16} /> Tugas Kelas / PR
        </button>
      </div>

      {/* MATERIALS TAB */}
      {activeTab === "materials" && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest font-mono">
            Materi yang Tersedia ({course.materials.length})
          </h3>

          {course.materials.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-sm shadow-sm">
              Guru Anda belum mengunggah materi pembelajaran apa pun untuk kelas ini.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {course.materials.map((material) => (
                <div
                  key={material.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300/30 transition-all flex flex-col justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h4 className="font-bold text-slate-800 text-md flex items-center gap-2">
                        <FileText size={16} className="text-blue-600" /> {material.title}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(material.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-150">
                      {material.content}
                    </div>
                  </div>

                  {material.fileUrl && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-600 font-medium truncate max-w-[200px]">
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
      )}

      {/* ASSIGNMENTS TAB */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          {course.assignments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-sm shadow-sm">
              Tidak ada tugas yang aktif saat ini. Kerja bagus!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side: Tasks List */}
              <div className="lg:col-span-1 space-y-3">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono mb-1">
                  Direktori Tugas Kelas
                </h3>
                {course.assignments.map((assignment) => {
                  const hasSub = assignment.submissions.length > 0;
                  const isGrad = assignment.submissions[0]?.status === "GRADED";
                  return (
                    <div
                      key={assignment.id}
                      onClick={() => {
                        setSelectedAssignmentId(assignment.id);
                        setIsResubmitting(false);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-sm ${
                        selectedAssignmentId === assignment.id
                          ? "bg-blue-50 border-blue-500 shadow-blue-100/10"
                          : "bg-white border-slate-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-slate-800">{assignment.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                          <Calendar size={12} />
                          <span>Tenggat: {new Date(assignment.dueDate).toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                        <span className="text-[10px] font-bold font-mono text-blue-600">
                          {assignment.maxPoints} Poin
                        </span>
                        
                        {isGrad ? (
                          <span className="px-2 py-0.5 rounded bg-green-50 border border-green-200 text-green-600 font-mono text-[9px] font-bold">
                            Nilai: {assignment.submissions[0].points} Poin
                          </span>
                        ) : hasSub ? (
                          <span className="px-2 py-0.5 rounded bg-amber-55 bg-amber-50 border border-amber-200 text-amber-600 font-mono text-[9px] font-bold">
                            Sudah Dikirim
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-400 font-mono text-[9px] font-bold">
                            Belum Dikirim
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Side: Work Details & Submission form */}
              <div className="lg:col-span-2 space-y-4">
                {activeAssignment ? (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{activeAssignment.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-1">
                          <Calendar size={14} />
                          <span>Tenggat Waktu: {new Date(activeAssignment.dueDate).toLocaleString("id-ID")}</span>
                        </div>
                      </div>

                      <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-sm font-bold font-mono text-slate-700 shrink-0 shadow-sm">
                        <Award className="text-blue-500" size={16} />
                        <span>Poin Maksimal: {activeAssignment.maxPoints}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 font-mono uppercase">
                        Petunjuk Pengerjaan Tugas
                      </label>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-150 text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {activeAssignment.description}
                      </div>
                    </div>

                    {/* Submit Section */}
                    <div className="border-t border-slate-100 pt-6 space-y-4">
                      <h4 className="font-bold text-sm text-slate-850">Jawaban Tugas Anda</h4>

                      {/* Display current status */}
                      {isSubmitted && !isResubmitting ? (
                        <div className="space-y-4">
                          {/* Success state info */}
                          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2.5 text-xs text-blue-700 font-semibold">
                              <CheckCircle size={16} className="text-blue-500" />
                              <span>Pekerjaan Anda telah berhasil dikirim.</span>
                            </div>
                            {!isGraded && (
                              <button
                                onClick={() => setIsResubmitting(true)}
                                className="text-xs text-blue-600 hover:text-blue-500 font-bold cursor-pointer"
                              >
                                Ubah Jawaban
                              </button>
                            )}
                          </div>

                          {/* Student submit files */}
                          {activeSubmission.content && (
                            <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-600 whitespace-pre-wrap leading-relaxed font-mono">
                              {activeSubmission.content}
                            </div>
                          )}

                          {activeSubmission.fileUrl && (
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs max-w-md">
                              <span className="text-slate-600 font-medium truncate max-w-[200px]">
                                📎 {activeSubmission.fileName || "file_jawaban"}
                              </span>
                              <a
                                href={`/api/download?file=${encodeURIComponent(activeSubmission.fileUrl)}&name=${encodeURIComponent(activeSubmission.fileName || "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 font-semibold text-xs cursor-pointer"
                              >
                                <Download size={12} /> Unduh Jawaban
                              </a>
                            </div>
                          )}

                          {/* Teacher review grading panel */}
                          {isGraded && (
                            <div className="p-5 rounded-2xl bg-green-50 border border-green-200 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-green-600 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                                  <FileCheck size={16} /> Catatan & Evaluasi Guru
                                </span>
                                <span className="px-3 py-1 rounded bg-green-100 border border-green-200 text-green-600 font-mono text-sm font-extrabold">
                                  Nilai: {activeSubmission.points} / {activeAssignment.maxPoints}
                                </span>
                              </div>
                              {activeSubmission.feedback ? (
                                <p className="text-xs text-slate-600 leading-relaxed italic bg-white p-3 rounded-xl border border-green-100">
                                  "{activeSubmission.feedback}"
                                </p>
                              ) : (
                                <p className="text-xs text-slate-400 leading-relaxed italic">
                                  Tidak ada catatan umpan balik yang diberikan.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Submission form */
                        <form action={submitFormAction} className="space-y-4">
                          <input type="hidden" name="assignmentId" value={activeAssignment.id} />
                          <input type="hidden" name="courseId" value={course.id} />

                          {submitState?.error && (
                            <div className="p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">
                              {submitState.error}
                            </div>
                          )}
                          {submitState?.success && (
                            <div className="p-2.5 rounded-xl bg-green-50 border border-green-100 text-green-600 text-xs">
                              {submitState.success}
                            </div>
                          )}

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Catatan Jawaban / Komentar</label>
                            <textarea
                              name="content"
                              rows={4}
                              placeholder="Tulis lembar jawaban tugas Anda atau masukkan link pengerjaan..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:bg-white transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-600">Unggah Lampiran Hasil Pengerjaan</label>
                            <input
                              name="file"
                              type="file"
                              className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 file:font-semibold hover:file:bg-slate-200 file:transition-colors file:cursor-pointer"
                            />
                          </div>

                          <div className="flex items-center gap-3 pt-2">
                            <button
                              type="submit"
                              disabled={isSubmitPending}
                              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-500/10"
                            >
                              {isSubmitPending ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : isResubmitting ? (
                                "Simpan Perubahan Jawaban"
                              ) : (
                                "Kumpulkan Tugas"
                              )}
                            </button>
                            {isResubmitting && (
                              <button
                                type="button"
                                onClick={() => setIsResubmitting(false)}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
                              >
                                Batalkan
                              </button>
                            )}
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs shadow-sm">
                    Pilih salah satu tugas dari direktori di sebelah kiri untuk melihat instruksi pengerjaan dan mengumpulkan jawaban.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
