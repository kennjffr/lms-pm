import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-that-is-very-long-and-should-be-changed";

export interface UserSession {
  id: number;
  email: string;
  name: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  programId?: number | null;
  currentSemester?: number | null;
}

export function signToken(user: UserSession): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" });
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("lms_token")?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, JWT_SECRET) as UserSession;
    return decoded;
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("lms_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("lms_token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}
