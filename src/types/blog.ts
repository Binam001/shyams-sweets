export type Blog = {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  excerpt: string;
  description: string;
  sortOrder: number;
  estimatedReadTime: number;
  // isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
