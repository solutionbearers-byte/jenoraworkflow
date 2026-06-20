import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select(`
      id,
      email,
      full_name,
      password_hash,
      org_id,
      is_active,
      user_roles (
        role:roles (
          id,
          name,
          hierarchy_level,
          permissions
        )
      )
    `)
    .eq("email", email)
    .single();

  if (error || !user) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  if (!user.is_active) {
    return NextResponse.json(
      { error: "Your account has been deactivated. Contact your administrator." },
      { status: 403 }
    );
  }

  const normalizedHash = user.password_hash.replace(/^\$2a\$/, '$2b$');
  const valid = await bcrypt.compare(password, normalizedHash);

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const role = (user.user_roles as any)?.[0]?.role;

  if (!role) {
    return NextResponse.json(
      { error: "No role assigned to this user. Contact your administrator." },
      { status: 403 }
    );
  }

  const payload = {
    sub:             user.id,
    org_id:          user.org_id,
    email:           user.email,
    full_name:       user.full_name,
    role_id:         role.id,
    role_name:       role.name,
    hierarchy_level: role.hierarchy_level,
    is_super_admin:  role.name === "super_admin",
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "8h" });

  const response = NextResponse.json({
    user: {
      id:              user.id,
      email:           user.email,
      full_name:       user.full_name,
      org_id:          user.org_id,
      role_name:       role.name,
      hierarchy_level: role.hierarchy_level,
      
    }
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 8,
    path:     "/",
  });

  return response;
}