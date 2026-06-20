import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export type AuthUser = {
  sub:             string;
  org_id:          string;
  email:           string;
  full_name:       string;
  role_id:         string;
  role_name:       string;
  hierarchy_level: number;
  is_super_admin:  boolean;
};

export function getAuthUser(req: NextRequest): AuthUser | null {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
  } catch {
    return null;
  }
}

export function requireSuperAdmin(req: NextRequest): AuthUser | NextResponse {
  const user = getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.is_super_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return user;
}