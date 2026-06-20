import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const { orgId } = params;

    const { data, error } = await supabaseAdmin
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (error || !data) return NextResponse.json({ error: "Organization not found." }, { status: 404 });

    return NextResponse.json({ organization: data });
  } catch (err) {
    return NextResponse.json({ error: "Unable to fetch organization." }, { status: 500 });
  }
}
