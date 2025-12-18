import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryTable } from "./CategoryTable";
import { Columns, type Category } from "./CategoryColumns";
import { categoryApi } from "@/apis/api-call";
import { Button } from "../ui/button";
import { Icon } from "@iconify/react";
import Breadcrumb from "../dashboard/Breadcrumb";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

const CategoryPage = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null
  );
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await categoryApi.getAllCategories({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      });
      setData(result.data.categories || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openDeleteModal = (id: string) => {
    setCategoryIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (!categoryIdToDelete) return;
    try {
      await categoryApi.deleteCategory(categoryIdToDelete);
      toast.success("Category deleted successfully");
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setIsDeleteModalOpen(false);
      setCategoryIdToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb links={[{ label: "Categories" }]} />
        <Button onClick={() => navigate("/dashboard/category/addCategory")}>
          <Icon icon="lucide:plus" />
          Add Category
        </Button>
      </div>
      <CategoryTable
        columns={Columns}
        data={data}
        handleDelete={openDeleteModal}
      />
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

export default CategoryPage;
