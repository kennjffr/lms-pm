import { logoutAction } from "@/app/actions";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  user: {
    name: string;
    email: string;
    role: "ADMIN" | "TEACHER" | "STUDENT";
  };
}

export default function Navbar({ user }: NavbarProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-blue-50 border-blue-200 text-blue-600";
      case "TEACHER":
        return "bg-blue-50 border-blue-200 text-blue-600";
      case "STUDENT":
        return "bg-emerald-50 border-emerald-200 text-emerald-600";
      default:
        return "bg-slate-100 border-slate-200 text-slate-500";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "ADMIN";
      case "TEACHER":
        return "GURU";
      case "STUDENT":
        return "SISWA";
      default:
        return role;
    }
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between z-40 text-slate-800 shadow-sm shadow-slate-100/20">
      {/* Logo branding */}
      <div className="flex items-center gap-3">
        <Link href="/" className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-sm text-white shadow-sm shadow-blue-500/10 hover:scale-105 transition-transform">
          IT
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-800">SMK Media Informatika</span>
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wider ${getRoleColor(user.role)}`}>
              {getRoleLabel(user.role)}
            </span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono tracking-wider uppercase block">
            Portal LMS Akademik
          </span>
        </div>
      </div>

      {/* User profile & Action */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-right">
          <div className="hidden md:block">
            <div className="text-xs font-semibold text-slate-700">{user.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 text-xs">
            <User size={16} />
          </div>
        </div>

        <form action={logoutAction} className="border-l border-slate-200 pl-4">
          <button
            type="submit"
            title="Keluar"
            className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-600 transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </form>
      </div>
    </header>
  );
}
