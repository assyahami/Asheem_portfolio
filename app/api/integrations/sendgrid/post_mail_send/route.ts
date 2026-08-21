/**
 * Platform-owned integration route — DO NOT EDIT.
 *
 * Injected by the platform. Call from the UI as:
 *   fetch('/api/integrations/sendgrid/post_mail_send', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ ...actionParams }),
 *   })
 *
 * Execution endpoint baked from integration_action_master:
 *   POST /mail/send
 */
import { NextRequest, NextResponse } from 'next/server';
import { handleIntegrationAction } from '@/lib/integrations/connectors/handleIntegrationAction';

const BAKED = {
  method: "POST",
  endpoint: "/mail/send",
  fields: [{"key":"asm","location":"body"},{"key":"attachments","location":"body"},{"key":"batch_id","location":"body"},{"key":"categories","location":"body"},{"key":"content","location":"body"},{"key":"custom_args","location":"body"},{"key":"from","location":"body"},{"key":"headers","location":"body"},{"key":"ip_pool_name","location":"body"},{"key":"mail_settings","location":"body"},{"key":"personalizations","location":"body"},{"key":"reply_to","location":"body"},{"key":"reply_to_list","location":"body"},{"key":"send_at","location":"body"},{"key":"subject","location":"body"},{"key":"template_id","location":"body"},{"key":"tracking_settings","location":"body"}] as Array<{ key: string; location?: 'path' | 'query' | 'body' | 'header' }>,
};

async function paramsFromRequest(req: NextRequest): Promise<Record<string, unknown>> {
  const fromQuery: Record<string, unknown> = {};
  req.nextUrl.searchParams.forEach((value, key) => {
    fromQuery[key] = value;
  });
  let body: Record<string, unknown> = {};
  try {
    const parsed = await req.json();
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    // GET or empty body
  }
  return { ...fromQuery, ...body };
}


/**
 * Refuse unauthenticated HTTP callers.
 *
 * The platform sets AS_INTEGRATION_ROUTE_TOKEN for apps that have auth, and
 * the app's proxy forwards it only after verifying a session — so an external
 * caller cannot present one. Server-side code in this app should not call this
 * URL at all: import handleIntegrationAction directly, which skips the network
 * hop and this check, because in-process code is already inside the boundary
 * the check defends.
 */
const INTEGRATION_CALL_TOKEN_HEADER = 'x-as-integration-token';

function integrationCallAuthorized(presented: string | null): boolean {
  const expected = process.env.AS_INTEGRATION_ROUTE_TOKEN;
  if (!expected) return true;
  if (!presented || presented.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ presented.charCodeAt(i);
  }
  return diff === 0;
}

async function run(req: NextRequest) {
  if (!integrationCallAuthorized(req.headers.get(INTEGRATION_CALL_TOKEN_HEADER))) {
    return NextResponse.json({ success: false, error: 'Unauthorized.' }, { status: 401 });
  }
  const result = await handleIntegrationAction(
    "sendgrid",
    "post_mail_send",
    await paramsFromRequest(req),
    BAKED,
  );
  return NextResponse.json(
    {
      success: result.success,
      data: result.data,
      ...(result.success ? {} : { error: result.error }),
    },
    { status: result.statusCode },
  );
}

export async function GET(req: NextRequest) {
  return run(req);
}

export async function POST(req: NextRequest) {
  return run(req);
}
