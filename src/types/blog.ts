export type Blog = {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  description: string;
  sortOrder: number;
  estimatedReadTime: number;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  mediaAssets: any[];
  seoMetadata: any;
};

export type BlogListResponse = {
  status: string;
  msg: string;
  data: Blog[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
  fromCache: boolean;
};
