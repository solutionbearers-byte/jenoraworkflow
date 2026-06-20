import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  const { orgId } = params;

  const { data, error } = await supabaseAdmin
    .from("roles")
    .select("*")
    .eq("org_id", orgId)
    .order("hierarchy_level", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ roles: data ?? [] });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { name, hierarchy_level, parent_role_id } = await req.json();

    if (!name || hierarchy_level == null) {
      return NextResponse.json({ error: "Role name and hierarchy level are required." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("roles")
      .insert({ org_id: params.orgId, name, hierarchy_level: Number(hierarchy_level), parent_role_id: parent_role_id || null })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ role: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Unable to create role." }, { status: 500 });
  }
}
