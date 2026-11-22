import { authClient } from "./auth-client";

export const getJwtToken = async () => {
  const { data, error } = await authClient.token();
  if (error || !data?.token) {
    // ask the user to log in again
    return;
  }
  const token = data.token;
  return token;
};
