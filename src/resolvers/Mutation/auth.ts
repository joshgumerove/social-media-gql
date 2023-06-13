import { Context } from "../..";

export const authResolvers = {
  signup: (
    _: any,
    {
      email,
      name,
      password,
      bio,
    }: { email: string; name: string; password: string; bio: string },
    { prisma }: Context
  ) => {},
};
