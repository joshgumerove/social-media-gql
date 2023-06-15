import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../keys";

export const getUserFromToken = (token: string) => {
  try {
    return JWT.verify(token, JSON_SIGNATURE) as {
      userId: number;
      email: string;
    };
  } catch (error) {
    return null;
  }
};
