import { postResolvers } from "./post";
import { authResolvers } from "./auth";
const Mutation = {
  ...postResolvers,
  ...authResolvers,
};

export { Mutation };
