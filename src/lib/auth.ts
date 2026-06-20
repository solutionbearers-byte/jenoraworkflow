import { NextRequest } from "next/server";
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