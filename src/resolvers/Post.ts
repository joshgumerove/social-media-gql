import { Context } from "..";

interface PostParentType {
  authorId: number;
}

export const Post = {
  user: async (parent: PostParentType, _: any, { prisma }: Context) => {
    return await prisma.user.findUnique({
      where: {
        id: parent.authorId,
      },
    });
  },
};
