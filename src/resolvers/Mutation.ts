import { Context } from "..";

interface PostCreateArgs {
  title: string;
  content: string;
}

const Mutation = {
  postCreate: async (
    _: any,
    { title, content }: PostCreateArgs,
    { prisma }: Context
  ) => {
    prisma.post.create({
      data: {
        title,
        content,
        authorId: 1,
      },
    });
  },
};

export { Mutation };
