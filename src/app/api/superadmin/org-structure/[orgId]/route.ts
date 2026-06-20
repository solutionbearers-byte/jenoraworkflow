import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  const auth = requireSuperAdmin(req);
  if (auth instanceof NextResponse) return auth;
  const { orgId } = await context.params;

  const { data, error } = await supabaseAdmin
    .from("roles")
    .select("*")
    .eq("org_id", orgId)
    .order("hierarchy_level", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // return raw roles; client can build tree
  return NextResponse.json({ roles: data ?? [] });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ orgId: string }> }
) {
  const auth = requireSuperAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { orgId } = await context.params;

  try {
    const { role_id, parent_role_id, name, hierarchy_level } = await req.json();

    // If role_id provided, just link existing role to parent
    if (role_id && parent_role_id) {
      const { error } = await supabaseAdmin
        .from("roles")
        .update({ parent_role_id })
        .eq("id", role_id);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ success: true });
    }

    // Otherwise create a new role and link
    if (!name || hierarchy_level == null) {
      return NextResponse.json({ error: "Name and hierarchy_level required to create role." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("roles")
      .insert({ org_id: orgId, name, hierarchy_level: Number(hierarchy_level), parent_role_id: parent_role_id || null })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ role: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Unable to update org structure." }, { status: 500 });
  }
}
