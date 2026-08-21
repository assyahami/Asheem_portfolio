"use client";

import type { ReactNode } from "react";

/**
 * Platform-owned session shell (passthrough until auth is provisioned).
 *
 * Locked path — agents must not edit. `provisionAuthForApp` replaces this
 * file with the NextAuth `SessionProvider` wrapper from the auth bundle.
 * Until then, return children so mock / no-auth apps never hit
 * `/api/auth/session`.
 */
export function AuthSessionProvider({
  children,
}: {
  children: ReactNode;
  session?: unknown;
}) {
  return <>{children}</>;
}
