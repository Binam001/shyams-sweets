import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type Category = {
  id: string;
  title: string;
  coverImage: string;
};

export const Columns: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        checked={row.getIsSelected()}
      />
    ),
  },
  {
    id: "sn",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          S.N.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: "coverImage",
    header: "Cover Image",
    cell: ({ row, table }) => {
      const imageUrl = row.getValue("coverImage") as string;
      const handlePreview = table.options.meta?.handlePreview;

      return (
        <div
          className="cursor-pointer"
          onClick={() => handlePreview && handlePreview(imageUrl)}
        >
          <img
            src={imageUrl}
            alt={row.getValue("title") as string}
            className="h-16 w-16 rounded-md object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    // header: "Name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    id: "view",
    header: "View Category",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const category = row.original;
      return (
        <Button
          variant={"outline"}
          onClick={() => navigate(`/dashboard/category/${category.id}`)}
        >
          View Category
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: () => {
      return <Button variant="ghost">Action</Button>;
    },
    cell: ({ row, table }) => {
      const category = row.original;
      const handleDelete = table.options.meta?.handleDelete;
      const navigate = useNavigate();

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
            <DropdownMenuItem
              onClick={() =>
                navigate(`/dashboard/category/edit/${category.id}`)
              }
            >
              Edit Category
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 hover:text-red-500 focus:text-red-500"
              onClick={() => handleDelete && handleDelete(category.id)}
            >
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
