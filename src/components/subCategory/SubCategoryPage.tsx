import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Breadcrumb from "../dashboard/Breadcrumb";
import { Icon } from "@iconify/react";
import { subCategoryApi } from "@/apis/api-call";
import { DataTablePagination } from "../category/DataTablePagination";
import { Columns as subCategoryColumns } from "./SubCategoryColumns";
import type { SubCategory } from "./SubCategoryColumns";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface SubCategoryPageProps {
  title: string;
}

const SubCategoryPage = ({ title }: SubCategoryPageProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );

  const params = useParams();
  const navigate = useNavigate();

  const fetchSubCategories = async () => {
    if (!params.id) return;
    try {
      setLoading(true);
      const response = await subCategoryApi.getAllSubCategories(params.id);
      const data =
        response.data.subCategories ||
        response.data.data ||
        response.data ||
        [];
      setSubCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      setSubCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [params.id]);

  const handleDeleteCategory = async () => {
    if (!categoryIdToDelete) return;
    try {
      await subCategoryApi.deleteSubCategory(categoryIdToDelete);
      toast.success("Category deleted successfully");
      fetchSubCategories(); // Refresh data
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleteModalOpen(false);
      setCategoryIdToDelete(null);
    }
  };

  const handleDelete = (id: string) => {
    setCategoryIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const table = useReactTable({
    data: subCategories,
    columns: subCategoryColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
    },
    meta: {
      handleDelete,
      // handlePreview,
    },
  });
  const links = [
    { href: "/dashboard/category", label: "Categories" },
    {
      label: params.slug || "Sub Category",
      isActive: true,
    },
  ];
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb links={links} />
        <Button
          onClick={() =>
            navigate(`/dashboard/category/${params.id}/create-subcategory`)
          }
        >
          <Icon icon="lucide:plus" />
          Add Sub Category
        </Button>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={subCategoryColumns.length}
                  className="h-24 text-center"
                >
                  {loading ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              category.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubCategoryPage;
