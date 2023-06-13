import { Context } from "../..";
import validator from "validator";

interface SignupArgs {
  email: string;
  name: string;
  password: string;
  bio: string;
}

interface UserPayload {
  userErrors: { message: string }[];
  user: null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const isEmail = validator.isEmail(email);

    if (!Boolean(isEmail)) {
      return {
        userErrors: [{ message: "must provide a valid email" }],
        user: null,
      };
    }

    const isValidPassword = validator.isLength(password, {
      min: 5,
    });

    if (!Boolean(isValidPassword)) {
      return {
        userErrors: [{ message: "password must be at least 5 characters" }],
        user: null,
      };
    }

    if (!Boolean(name.trim()) || !Boolean(bio.trim())) {
      return {
        userErrors: [{ message: "must provide a name and bio" }],
        user: null,
      };
    }
    // const newUser = await prisma.user.create({
    //   data: {
    //     email,
    //     name,
    //     password,
    //   },
    // });

    return {
      userErrors: [],
      user: null,
    };
  },
};
