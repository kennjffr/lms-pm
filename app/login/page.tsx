import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();

  // If already logged in, go straight to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 min-h-screen items-center justify-center bg-slate-50 font-sans relative px-4 py-12 text-slate-800">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] bg-blue-400/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-emerald-400/10 rounded-full blur-3xl -z-10" />

      <LoginForm />
    </div>
  );
}
