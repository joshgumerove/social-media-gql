import { Context } from "..";
import { Post } from "@prisma/client";

const Query = {
  hello: () => "Hello World",
  posts: async (_: any, __: any, context: Context): Promise<Post[]> => {
    const { prisma } = context;

    const posts = await prisma.post.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return posts;
  },
};

export { Query };
