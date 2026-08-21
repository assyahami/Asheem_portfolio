import { NextRequest, NextResponse } from "next/server";
import { handleIntegrationAction } from "@/lib/integrations/connectors/handleIntegrationAction";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
    };

    // Validate all three fields
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const safeName = name.trim();
    const safeEmail = email.trim();
    const safeMessage = message.trim();

    // ── SendGrid: send notification email (fatal on failure) ──────────────────
    const sgResult = await handleIntegrationAction("sendgrid", "post_mail_send", {
      personalizations: [{ to: [{ email: "ashiq.ahamed@kanan.co" }] }],
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || "onboarding@sendgrid.net",
        name: "Asheem Portfolio",
      },
      subject: `New Collab Request from ${safeName}`,
      content: [
        {
          type: "text/html",
          value: `<p><strong>Name:</strong> ${safeName}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Message:</strong> ${safeMessage}</p>`,
        },
      ],
    });

    if (!sgResult.success) {
      const errMsg =
        typeof sgResult.error === "string" && sgResult.error.trim()
          ? sgResult.error
          : "Failed to send email via SendGrid.";
      console.error("[contact] SendGrid error:", sgResult.error);
      return NextResponse.json({ error: errMsg }, { status: 500 });
    }

    // ── Google Sheets: append lead row (non-fatal) ────────────────────────────
    const spreadsheetId = process.env.GOOGLE_SHEETS_LEAD_SPREADSHEET_ID;
    if (spreadsheetId) {
      try {
        const gsResult = await handleIntegrationAction(
          "google_sheets",
          "sheets_spreadsheets_values_append",
          {
            spreadsheetId,
            range: "Sheet1!A:D",
            valueInputOption: "USER_ENTERED",
            values: [[new Date().toISOString(), safeName, safeEmail, safeMessage]],
          }
        );
        if (!gsResult.success) {
          console.warn("[contact] Google Sheets append failed (non-fatal):", gsResult.error);
        }
      } catch (gsErr: unknown) {
        console.warn("[contact] Google Sheets append threw (non-fatal):", gsErr);
      }
    } else {
      console.info("[contact] GOOGLE_SHEETS_LEAD_SPREADSHEET_ID not set — skipping sheet append.");
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("[contact] Unexpected error:", err);
    const message =
      err instanceof Error && err.message.trim()
        ? err.message
        : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
