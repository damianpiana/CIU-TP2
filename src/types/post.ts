export type Tag = {
  id: number;
  name: string;
};

export type Post = {
  id: number;
  description: string;
  userId: number;
  tags?: Tag[];
};

export type PostImage = {
  id?: number;
  url: string;
  postId: number;
};