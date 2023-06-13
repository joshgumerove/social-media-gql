import { Context } from "../..";

interface SignupArgs {
  email: string;
  name: string;
  password: string;
  bio: string;
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ) => {
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return newUser;
  },
};
