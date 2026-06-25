"use server";

import prisma from "@/lib/db";
import { signToken, setSessionCookie, logout, getSession } from "@/lib/auth";
import { uploadFile } from "@/lib/s3";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Role, SubmissionStatus } from "@prisma/client";

// ==========================================
// AUTH ACTIONS
// ==========================================

export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Silakan masukkan email dan kata sandi." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { program: true },
    });

    if (!user) {
      return { error: "Email atau kata sandi salah." };
    }

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordMatch) {
      return { error: "Email atau kata sandi salah." };
    }

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      programId: user.programId,
      currentSemester: user.currentSemester,
    };

    const token = signToken(sessionData);
    await setSessionCookie(token);
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan sistem. Silakan coba lagi." };
  }

  // Redirect on success
  redirect("/dashboard");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}

// ==========================================
// ADMIN ACTIONS
// ==========================================

export async function createProgramAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    return { error: "Akses ditolak. Anda bukan admin." };
  }

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;

  if (!name || !code || !description) {
    return { error: "Semua kolom input wajib diisi." };
  }

  try {
    await prisma.program.create({
      data: {
        name,
        code: code.toUpperCase().trim(),
        description,
      },
    });
    revalidatePath("/dashboard/admin");
    return { success: "Program keahlian (jurusan) berhasil dibuat!" };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Program keahlian dengan nama atau kode ini sudah ada." };
    }
    return { error: "Gagal membuat program keahlian." };
  }
}

export async function createCourseAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    return { error: "Akses ditolak. Anda bukan admin." };
  }

  const name = formData.get("name") as string;
  const code = formData.get("code") as string;
  const description = formData.get("description") as string;
  const semesterStr = formData.get("semester") as string;
  const programIdStr = formData.get("programId") as string;
  const teacherIdStr = formData.get("teacherId") as string;

  if (!name || !code || !description || !semesterStr || !programIdStr || !teacherIdStr) {
    return { error: "Semua kolom input wajib diisi." };
  }

  const semester = parseInt(semesterStr);
  const programId = parseInt(programIdStr);
  const teacherId = parseInt(teacherIdStr);

  try {
    await prisma.course.create({
      data: {
        name,
        code: code.toUpperCase().trim(),
        description,
        semester,
        programId,
        teacherId,
      },
    });
    revalidatePath("/dashboard/admin");
    return { success: "Mata pelajaran berhasil dibuat!" };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Mata pelajaran dengan kode ini sudah terdaftar." };
    }
    console.error("Create course error:", error);
    return { error: "Gagal membuat mata pelajaran." };
  }
}

export async function createUserAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== Role.ADMIN) {
    return { error: "Akses ditolak. Anda bukan admin." };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Role;
  const programIdStr = formData.get("programId") as string;
  const semesterStr = formData.get("semester") as string;

  if (!name || !email || !password || !role) {
    return { error: "Nama, email, kata sandi, dan peran wajib diisi." };
  }

  try {
    const passwordHash = bcrypt.hashSync(password, 10);
    const programId = programIdStr ? parseInt(programIdStr) : null;
    const currentSemester = semesterStr ? parseInt(semesterStr) : null;

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        programId: role === Role.STUDENT ? programId : null,
        currentSemester: role === Role.STUDENT ? currentSemester : null,
      },
    });
    revalidatePath("/dashboard/admin");
    return { success: "Akun pengguna baru berhasil didaftarkan!" };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Pengguna dengan email ini sudah terdaftar." };
    }
    console.error("Create user error:", error);
    return { error: "Gagal mendaftarkan pengguna baru." };
  }
}

// ==========================================
// TEACHER ACTIONS
// ==========================================

export async function createMaterialAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== Role.TEACHER) {
    return { error: "Akses ditolak. Anda bukan guru." };
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const courseIdStr = formData.get("courseId") as string;
  const file = formData.get("file") as File;

  if (!title || !content || !courseIdStr) {
    return { error: "Judul, konten materi, dan mata pelajaran wajib diisi." };
  }

  const courseId = parseInt(courseIdStr);

  try {
    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileKey = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      await uploadFile(fileKey, buffer, file.type);
      fileUrl = fileKey;
      fileName = file.name;
    }

    await prisma.material.create({
      data: {
        title,
        content,
        fileUrl,
        fileName,
        courseId,
      },
    });

    revalidatePath(`/dashboard/teacher/courses/${courseId}`);
    return { success: "Materi pembelajaran berhasil dipublikasikan!" };
  } catch (error) {
    console.error("Create material error:", error);
    return { error: "Gagal mempublikasikan materi." };
  }
}

export async function createAssignmentAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== Role.TEACHER) {
    return { error: "Akses ditolak. Anda bukan guru." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDateStr = formData.get("dueDate") as string;
  const maxPointsStr = formData.get("maxPoints") as string;
  const courseIdStr = formData.get("courseId") as string;

  if (!title || !description || !dueDateStr || !maxPointsStr || !courseIdStr) {
    return { error: "Semua kolom input wajib diisi." };
  }

  const courseId = parseInt(courseIdStr);
  const maxPoints = parseInt(maxPointsStr);
  const dueDate = new Date(dueDateStr);

  try {
    await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate,
        maxPoints,
        courseId,
      },
    });

    revalidatePath(`/dashboard/teacher/courses/${courseId}`);
    return { success: "Tugas kelas berhasil diterbitkan!" };
  } catch (error) {
    console.error("Create assignment error:", error);
    return { error: "Gagal menerbitkan tugas baru." };
  }
}

export async function gradeSubmissionAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== Role.TEACHER) {
    return { error: "Akses ditolak. Anda bukan guru." };
  }

  const submissionIdStr = formData.get("submissionId") as string;
  const pointsStr = formData.get("points") as string;
  const feedback = formData.get("feedback") as string;
  const courseIdStr = formData.get("courseId") as string;

  if (!submissionIdStr || !pointsStr) {
    return { error: "ID pengumpulan dan poin nilai wajib diisi." };
  }

  const submissionId = parseInt(submissionIdStr);
  const points = parseInt(pointsStr);
  const courseId = parseInt(courseIdStr);

  try {
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        points,
        feedback,
        status: SubmissionStatus.GRADED,
      },
    });

    revalidatePath(`/dashboard/teacher/courses/${courseId}`);
    return { success: "Penilaian tugas siswa berhasil disimpan!" };
  } catch (error) {
    console.error("Grade submission error:", error);
    return { error: "Gagal menyimpan penilaian." };
  }
}

// ==========================================
// STUDENT ACTIONS
// ==========================================

export async function submitAssignmentAction(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== Role.STUDENT) {
    return { error: "Akses ditolak. Anda bukan siswa." };
  }

  const assignmentIdStr = formData.get("assignmentId") as string;
  const content = formData.get("content") as string;
  const file = formData.get("file") as File;
  const courseIdStr = formData.get("courseId") as string;

  if (!assignmentIdStr || !courseIdStr) {
    return { error: "ID Tugas tidak valid." };
  }

  const assignmentId = parseInt(assignmentIdStr);
  const courseId = parseInt(courseIdStr);

  try {
    let fileUrl: string | null = null;
    let fileName: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileKey = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      await uploadFile(fileKey, buffer, file.type);
      fileUrl = fileKey;
      fileName = file.name;
    }

    // Use upsert to handle case if student resubmits
    await prisma.submission.upsert({
      where: {
        studentId_assignmentId: {
          studentId: session.id,
          assignmentId,
        },
      },
      update: {
        content,
        fileUrl: fileUrl || undefined,
        fileName: fileName || undefined,
        status: SubmissionStatus.SUBMITTED,
        // Reset points and feedback upon resubmission
        points: null,
        feedback: null,
      },
      create: {
        studentId: session.id,
        assignmentId,
        content,
        fileUrl,
        fileName,
        status: SubmissionStatus.SUBMITTED,
      },
    });

    revalidatePath(`/dashboard/student/courses/${courseId}`);
    return { success: "Tugas berhasil dikumpulkan!" };
  } catch (error) {
    console.error("Submit assignment error:", error);
    return { error: "Gagal mengumpulkan tugas." };
  }
}
