import { useParams } from "react-router-dom";
import { useGetBlogById } from "@/hooks/useBlogs";
import { BlogForm } from "./BlogForm";
import { Loader } from "lucide-react";

export default function EditBlog() {
  const { blogId } = useParams<{ blogId: string }>();
  const { data: blog, isLoading, isError } = useGetBlogById(blogId || "");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading blog. Please try again.
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center text-gray-500">
        Blog not found or no ID provided.
      </div>
    );
  }

  return (
    <BlogForm
      blog={blog}
      onSuccess={() => {
        // Handle success, e.g., navigate back to blog list
        console.log("Blog updated successfully!");
      }}
      onCancel={() => {
        // Handle cancel, e.g., navigate back to blog list
        console.log("Edit cancelled.");
      }}
    />
  );
}