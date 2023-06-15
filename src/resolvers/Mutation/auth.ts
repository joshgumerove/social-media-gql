import { Context } from "../..";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../../keys";

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface SigninArgs {
  credentials: {
    email: string;
    password: string;
  };
}

interface UserPayload {
  userErrors: { message: string }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;

    const isEmail = validator.isEmail(email);

    if (!Boolean(isEmail)) {
      return {
        userErrors: [{ message: "must provide a valid email" }],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(password, {
      min: 5,
    });

    if (!Boolean(isValidPassword)) {
      return {
        userErrors: [{ message: "password must be at least 5 characters" }],
        token: null,
      };
    }

    if (!Boolean(name.trim()) || !Boolean(bio.trim())) {
      return {
        userErrors: [{ message: "must provide a name and bio" }],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        userId: user.id,
        bio: bio,
      },
    });

    const token = await JWT.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JSON_SIGNATURE,
      {
        expiresIn: 360000,
      }
    );

    return {
      userErrors: [],
      token: token,
    };
  },

  signin: async (
    _: any,
    { credentials }: SigninArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { email, password } = credentials;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    const invalidCredentialsMessage = {
      token: null,
      userErrors: [{ message: "Invalid Credentials" }],
    };

    if (!user) {
      return invalidCredentialsMessage;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return invalidCredentialsMessage;
    }

    const token = await JWT.sign(
      { userId: user.id, email: user.email },
      JSON_SIGNATURE,
      {
        expiresIn: 360000,
      }
    );

    return {
      token: token,
      userErrors: [],
    };
  },
};
