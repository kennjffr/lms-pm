import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Redirect based on role
  if (session.role === Role.ADMIN) {
    redirect("/dashboard/admin");
  } else if (session.role === Role.TEACHER) {
    redirect("/dashboard/teacher");
  } else if (session.role === Role.STUDENT) {
    redirect("/dashboard/student");
  }

  // Fallback
  redirect("/login");
}
