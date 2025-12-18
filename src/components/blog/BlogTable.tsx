import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
// import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
// import { toast } from "sonner";
// import { TableShimmer } from "../table-shimmer";
import type { Blog } from "@/types/blog";
import { useDeleteBlog } from "@/hooks/useBlogs";
// import { BlogViewModal } from "./BlogViewModal";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from "../ui/alert-dialog";
// import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface BlogTableProps {
  blogs: Blog[];
  isLoading: boolean;
  onEdit: (blog: Blog) => void;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage?: number;
    previousPage?: number;
  };
  onPageChange: (page: number) => void;
}

export function BlogTable({
  blogs,
  // isLoading,
  onEdit,
  pagination,
  onPageChange,
}: BlogTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const { mutate: deleteBlog, isPending } = useDeleteBlog();

  const handleDelete = async (blogId: string) => {
    await deleteBlog(blogId, {
      onSuccess: () => {
        toast("Blog deleted successfully");
        setDeleteDialogOpen(false);
      },
      onError: () => {
        toast("Failed to delete blog");
      },
    });
  };

  const columns: ColumnDef<Blog>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "sn", // Changed accessorKey to id for better practice when not directly mapping to a data key
      header: () => <div className="text-start">S.N.</div>,
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "coverImage",
      header: "Cover Image",
      cell: ({ row }) => (
        <img
          src={row.original.coverImage || "/placeholder.svg"}
          alt={row.original.title}
          width={40}
          height={40}
          className="h-10 w-10 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          {/* <CaretSortIcon className="ml-2 h-4 w-4" /> */}
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium line-clamp-1">{row.getValue("title")}</div>
      ),
    },

    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const blog = row.original;
        // const navigate = useNavigate(); // Not used directly in actions now

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(blog)}>
                Edit Blog
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 hover:text-red-500 focus:text-red-500"
                onClick={() => {
                  setBlogToDelete(blog);
                  setDeleteDialogOpen(true);
                }}
              >
                Delete Blog
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // if (isLoading) {
  //   return <TableShimmer />;
  // }

  return (
    <>
      <DataTable
        columns={columns}
        data={blogs}
        filterColumn="title"
        filterPlaceholder="Filter blogs..."
        pagination={{
          totalItems: pagination.total,
          currentPage: pagination.currentPage,
          itemsPerPage: pagination.itemsPerPage,
          onPageChange: onPageChange,
          totalPages: pagination.totalPages,
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the
              selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={() => blogToDelete && handleDelete(blogToDelete.id)}
            >
              {"Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
