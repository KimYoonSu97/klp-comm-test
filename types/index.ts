export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  likedBy: string[];
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  likedBy: string[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface CreateCommentData {
  content: string;
}
