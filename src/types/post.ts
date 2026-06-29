export interface Post {
  id: number;
  userId: number;
  description: string;
  tags?: any[];
  commentsCount?: number;
}

export interface Comment {
  id: number;
  postId?: number;
  PostId?: number;
  userId?: number;
  UserId?: number;
  content: string;
  User?: {
    id: number;
    nickName: string;
  };
}

export interface PostImage {
  id: number;
  postId: number;
  url: string;
}

export interface Tag {
  id: number;
  name: string;
}
