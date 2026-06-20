import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { org_name, contact_name, contact_email, message } = await req.json();

    if (!org_name || !contact_name || !contact_email) {
      return NextResponse.json(
        { error: "Organization name, contact name, and contact email are required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("org_requests").insert({
      org_name,
      contact_name,
      contact_email,
      message,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Unable to save organization request." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your request has been submitted. You will be contacted shortly.",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to process your request." },
      { status: 500 }
    );
  }
}
