import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const auth = requireSuperAdmin(req);
  if (auth instanceof NextResponse) return auth;

  const { data, error } = await supabaseAdmin
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ organizations: data ?? [] });
}

export async function POST(req: NextRequest) {
  const auth = requireSuperAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { name, slug, misc_buffer_pct, contact_name, contact_email } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("organizations")
      .insert({
        name,
        slug,
        misc_buffer_pct: misc_buffer_pct ? Number(misc_buffer_pct) : 0,
        contact_name: contact_name || null,
        contact_email: contact_email || null,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ organization: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Unable to create organization." }, { status: 500 });
  }
}
