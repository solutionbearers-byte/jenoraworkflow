import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { request_id, name, slug, misc_buffer_pct } = await req.json();

    if (!request_id || !name || !slug) {
      return NextResponse.json(
        { error: "Request ID, org name, and slug are required." },
        { status: 400 }
      );
    }

    const { data: request, error: requestError } = await supabaseAdmin
      .from("org_requests")
      .select("*")
      .eq("id", request_id)
      .single();

    if (requestError || !request) {
      return NextResponse.json(
        { error: "Organization request was not found." },
        { status: 404 }
      );
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        { error: "This request has already been processed." },
        { status: 400 }
      );
    }

    const { data: organization, error: orgError } = await supabaseAdmin
      .from("organizations")
      .insert({
        name,
        slug,
        misc_buffer_pct: misc_buffer_pct ? Number(misc_buffer_pct) : 0,
        contact_name: request.contact_name,
        contact_email: request.contact_email,
        request_id,
      })
      .select()
      .single();

    if (orgError || !organization) {
      return NextResponse.json(
        { error: orgError?.message || "Unable to create organization." },
        { status: 500 }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("org_requests")
      .update({ status: "approved" })
      .eq("id", request_id);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Created org, but failed to update request status." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, organization });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create organization." },
      { status: 500 }
    );
  }
}
