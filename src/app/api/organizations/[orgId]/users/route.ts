import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { full_name, email, role_id, password } = await req.json();

    if (!full_name || !email || !role_id || !password) {
      return NextResponse.json(
        { error: "Name, email, role, and password are required." },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .insert({
        org_id: params.orgId,
        full_name,
        email,
        password_hash,
        is_active: true,
      })
      .select()
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: userError?.message || "Unable to create user." }, { status: 500 });
    }

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: user.id, role_id });

    if (roleError) {
      return NextResponse.json({ error: roleError.message || "Unable to assign role to user." }, { status: 500 });
    }

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: "Unable to create user." }, { status: 500 });
  }
}
