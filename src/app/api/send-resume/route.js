import { NextResponse } from "next/server";
import { Resend } from "resend";


export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }


    const apiKey = process.env.RESEND_API_KEY;
    const resumeUrl = process.env.RESUME_PUBLIC_URL;
    const from = process.env.RESEND_FROM || "Resume <resume@boltluna.io";


if(!apiKey){
  console.error("Resend_API_KEY is not set");
  return NextResponse.json({
    error: "Email service is not configured"
  }, {status: 500});
}

if(!resumeUrl){
  console.error("RESUME_PUBLIC_URL is not set");
  return NextResponse.json(
    {error: "Resume URL is not configured."}, {status: 500}
  )
}
const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: email,
      subject: "My Resume",
      html: `
            <p>Hi there,</p>
            <p>Thanks for checking out my portfolio! Here's a link to my resume:</p>
            <p><a href = "${resumeUrl}">View / Download Resume</a></p>
            <p>Best,<br/>Mohammad</p>
            `,
    });

    if (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: "Failed to send email",
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}