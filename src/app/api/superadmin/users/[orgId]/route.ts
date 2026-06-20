import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const { orgId } = params;

  const { data, error } = await supabaseAdmin
    .from("users")
    .select(`
      id,
      full_name,
      email,
      is_active,
      user_roles (
        role:roles (
          id,
          name,
          hierarchy_level
        )
      )
    `)
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ users: data ?? [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { full_name, email, role_id, password } = await req.json();

    if (!full_name || !email || !role_id || !password) {
      return NextResponse.json({ error: "Name, email, role and password are required." }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .insert({ org_id: params.orgId, full_name, email, password_hash, is_active: true })
      .select()
      .single();

    if (userError || !user) return NextResponse.json({ error: userError?.message || "Unable to create user." }, { status: 500 });

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: user.id, role_id });

    if (roleError) return NextResponse.json({ error: roleError.message || "Unable to assign role." }, { status: 500 });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Unable to create user." }, { status: 500 });
  }
}
