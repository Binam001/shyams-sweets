import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { BlogTable } from "@/components/blog/Item-Table";
// import { BlogForm } from "@/components/blog/Item-Sheet";
// import { TableShimmer } from "@/components/table-shimmer";
import type { Blog } from "@/types/blog";
import { useGetPaginatedBlogs } from "@/hooks/useBlogs";
import { BlogTable } from "@/components/blog/BlogTable";
import { BlogForm } from "@/components/blog/BlogForm";

export default function BlogPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);
  const { data, isLoading } = useGetPaginatedBlogs(
    pagination.page,
    pagination.limit
  );

  return (
    <div className="container mx-auto py-2">
      {isAdding ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Add Blog</h1>
            <Button
              onClick={() => setIsAdding(false)}
              variant="outline"
              className="cursor-pointer"
            >
              Back to List
            </Button>
          </div>
          <BlogForm
            onSuccess={() => {
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : blogToEdit ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Edit Blog</h1>
            <Button
              onClick={() => setBlogToEdit(null)}
              variant="outline"
              className="cursor-pointer"
            >
              Back to List
            </Button>
          </div>
          <BlogForm
            blog={blogToEdit}
            onSuccess={() => {
              setBlogToEdit(null);
            }}
            onCancel={() => setBlogToEdit(null)}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Blog
            </Button>
          </div>

          {/* <Suspense fallback={<TableShimmer/>}> */}
          <BlogTable
            blogs={data?.data || []}
            isLoading={isLoading}
            onEdit={setBlogToEdit}
            pagination={{
              total: data?.pagination?.total || 0,
              totalPages: data?.pagination?.totalPages || 1,
              currentPage: data?.pagination?.currentPage || 1,
              itemsPerPage: data?.pagination?.itemsPerPage || 10,
              hasNextPage: data?.pagination?.hasNextPage || false,
              hasPreviousPage: data?.pagination?.hasPreviousPage || false,
              nextPage: data?.pagination?.nextPage || undefined,
              previousPage: data?.pagination?.previousPage || undefined,
            }}
            onPageChange={(newPage) => {
              setPagination((prev) => ({ ...prev, page: newPage }));
            }}
          />
          {/* </Suspense> */}
        </>
      )}
    </div>
  );
}
