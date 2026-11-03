
import { authClient } from "@/lib/auth-client";

/**
 * Returns a short-lived Better Auth JWT
 * for requests to the Express backend.
 */
export async function getAuthToken(): Promise<string> {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  return data.token;
}
