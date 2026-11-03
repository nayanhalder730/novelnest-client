
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getServerAuthToken(): Promise<string> {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.session) {
    throw new Error("Please login to continue.");
  }

  const tokenResponse = await auth.api.getToken({
    headers: requestHeaders,
  });

  if (!tokenResponse?.token) {
    throw new Error("Unable to generate authentication token.");
  }

  return tokenResponse.token;
}
