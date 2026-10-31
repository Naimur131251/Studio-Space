import { authClient } from "./auth-client";

export const getTokenFromClient = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    console.error("Token error:", error);
    throw new Error("JWT token not found. Please login again.");
  }

  return data.token;
};