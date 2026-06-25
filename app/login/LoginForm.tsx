"use client";

import { useActionState, useState } from "react";
import { loginAction } from "../actions";
import { KeyRound, Mail, Info, GraduationCap } from "lucide-react";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const fillDemo = (email: string) => {
    setSelectedDemo(email);
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (emailInput && passwordInput) {
      emailInput.value = email;
      if (email.startsWith("admin")) {
        passwordInput.value = "admin123";
      } else if (email.startsWith("budi")) {
        passwordInput.value = "teacher123";
      } else {
        passwordInput.value = "student123";
      }
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 z-10">
      {/* Branding */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-3 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-blue-500/20">
            IT
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">
            SMK Media Informatika
          </span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 pt-2">Masuk ke LMS</h2>
        <p className="text-slate-500 text-sm">Selamat datang! Silakan masukkan akun Anda.</p>
      </div>

      {/* Demo Credentials Alert Panel */}
      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 font-bold">
          <Info size={14} />Demo acc
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => fillDemo("admin@smk.sch.id")}
            className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${selectedDemo === "admin@smk.sch.id"
              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/10"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
              }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => fillDemo("budi@smk.sch.id")}
            className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${selectedDemo === "budi@smk.sch.id"
              ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-purple-600/10"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
              }`}
          >
            Guru
          </button>
          <button
            type="button"
            onClick={() => fillDemo("joko@smk.sch.id")}
            className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${selectedDemo === "joko@smk.sch.id"
              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/10"
              : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
              }`}
          >
            Siswa
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form action={formAction} className="space-y-4 p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-100/50">
        {state?.error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
            {state.error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-slate-600">
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail size={16} />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="nama@smk.sch.id"
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl focus:ring-1 focus:ring-blue-500 transition-colors text-slate-800 placeholder-slate-400 text-sm focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-xs font-semibold text-slate-600">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <KeyRound size={16} />
            </span>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl focus:ring-1 focus:ring-blue-500 transition-colors text-slate-800 placeholder-slate-400 text-sm focus:bg-white"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 font-semibold text-sm text-white transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menghubungkan...
              </>
            ) : (
              "Masuk ke Portal"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
