export type PostAuthor = {
  id: string;
  name: string;
};

export type PostComment = {
  id: string;
  content: string;
  createdAt: string;
  author: PostAuthor;
};

export type PostSummary = {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  createdAt: string;
  author: PostAuthor;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
};

export type PostDetails = PostSummary & {
  comments: PostComment[];
};