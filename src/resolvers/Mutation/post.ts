import { Post } from "@prisma/client";
import { Context } from "../..";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

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

export const postResolvers = {
  postCreate: async (
    _: any,
    { post: input }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    const { title, content } = input;

    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access (unauthenticated)" }],
        post: null,
      };
    }

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
        authorId: userInfo.userId,
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
    const { prisma, userInfo } = context;
    const { title, content } = post;

    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access (unauthenticated)" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

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

  postDelete: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    const post = await prisma.post.findUnique({
      where: { id: Number(postId) },
    });

    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access (unauthenticated)" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    if (!Boolean(post)) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }

    await prisma.post.delete({ where: { id: Number(postId) } });

    return {
      userErrors: [],
      post: post,
    };
  },

  postPublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ) => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access (unauthenticated)" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          published: true,
        },
      }),
    };
  },

  postUnpublish: async (
    _: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ) => {
    if (!userInfo) {
      return {
        userErrors: [{ message: "Forbidden access (unauthenticated)" }],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    return {
      userErrors: [],
      post: await prisma.post.update({
        where: {
          id: Number(postId),
        },
        data: {
          published: false,
        },
      }),
    };
  },
};
