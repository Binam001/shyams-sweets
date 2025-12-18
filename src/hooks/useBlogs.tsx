import { blogApi } from "../apis/api-call";
import type { Blog } from "../types/blog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetBlog = () => {
  return useQuery<Blog[]>({
    queryKey: ["blog"],
    queryFn: async () => {
      const response = await blogApi.getAllBlogs();
      return response.data; // This is already the blogs array from api-call.ts transformation
    },
  });
};

export const useGetPaginatedBlogs = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["blog", page, limit],
    queryFn: async () => {
      // blogApi.getAllBlogs already returns { data: blogs[], pagination: {...} }
      return await blogApi.getAllBlogs({ page, limit });
    },
  });
};

export const useGetBlogById = (id: string) => {
  return useQuery<Blog>({
    queryKey: ["blog", id],
    queryFn: async () => {
      const response = await blogApi.getOne(id);
      return response.data.data;
    },
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await blogApi.create(data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
};

export const useUpdateBlog = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FormData) => {
      const response = await blogApi.update(blogId, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await blogApi.delete(id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
    },
  });
};
