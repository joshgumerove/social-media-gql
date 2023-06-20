import { Context } from "..";
import { userLoader } from "../loaders/userLoader";

interface PostParentType {
  authorId: number;
}

export const Post = {
  user: (parent: PostParentType, _: any, { prisma }: Context) => {
    return userLoader.load(parent.authorId)
  },
};
