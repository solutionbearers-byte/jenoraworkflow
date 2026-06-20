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

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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
    const { name, hierarchy_level, parent_role_id } = await req.json();

    if (!name || hierarchy_level == null) {
      return NextResponse.json(
        { error: "Role name and hierarchy level are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("roles")
      .insert({
        org_id: orgId,
        name,
        hierarchy_level: Number(hierarchy_level),
        parent_role_id: parent_role_id || null,
      })
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Unable to create role." }, { status: 500 });
    }

    return NextResponse.json({ role: data });
  } catch (err) {
    return NextResponse.json({ error: "Unable to create role." }, { status: 500 });
  }
}
