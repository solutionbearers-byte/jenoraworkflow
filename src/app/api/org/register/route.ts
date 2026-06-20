import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { org_name, org_email, admin_full_name, admin_email, admin_password } = await req.json();

    if (!org_name || !org_email || !admin_full_name || !admin_email || !admin_password) {
      return NextResponse.json(
        { error: "All fields are required for organization registration." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Organization registration request submitted. Please check your email for next steps.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to process registration request." },
      { status: 500 }
    );
  }
}
