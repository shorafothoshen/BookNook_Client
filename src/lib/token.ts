import { authClient } from "./auth-client";

export async function getToken(): Promise<string> {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    throw new Error("Could not authenticate. Please log in again.");
  }
  return data.token;
}
