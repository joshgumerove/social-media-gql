import { Post } from "@prisma/client";
import { Context } from "..";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: { message: string }[];
  post: Post | null;
}

const Mutation = {
  postCreate: async (
    _: any,
    { post: input }: PostArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const { title, content } = input;

    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide a title and a content to create a post",
          },
        ],
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1,
      },
    });

    return {
      userErrors: [],
      post: post,
    };
  },
  postUpdate: async (
    _: any,
    { postId, post }: { postId: string; post: PostArgs["post"] }, // NOTE: can inline the type definition
    context: Context
  ): Promise<PostPayloadType> => {
    const { prisma } = context;
    const { title, content } = post;

    if (title || content) {
      const existingPost = await prisma.post.findUnique({
        where: { id: Number(postId) },
      });

      if (!Boolean(existingPost)) {
        return {
          userErrors: [{ message: "must provide a valid postId" }],
          post: null,
        };
      }

      return {
        userErrors: [],
        post: await prisma.post.update({
          where: {
            id: Number(postId),
          },
          data: {
            ...existingPost,
            ...post,
          },
        }),
      };
    }
    return {
      userErrors: [{ message: "must provide at least one field to update" }],
      post: null,
    };
  },
};

export { Mutation };
