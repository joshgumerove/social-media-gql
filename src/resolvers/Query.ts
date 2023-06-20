import { Context } from "..";
import { Post } from "@prisma/client";

const Query = {
  hello: () => "Hello World",
  me: (_: any, __: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;

    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },
  posts: async (_: any, __: any, context: Context): Promise<Post[]> => {
    const { prisma } = context;

    const posts = await prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return posts;
  },
};

export { Query };
