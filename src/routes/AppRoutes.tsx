import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import LoginPage from "@/components/LoginPage";
import AddCategory from "@/components/category/AddCategory";
import EditCategory from "../components/category/EditCategory";
import CategorySearchPage from "@/components/category/CategorySearchPage";
import AddSubCategory from "@/components/subCategory/AddSubCategory";
import SubCategoryPage from "@/components/subCategory/SubCategoryPage";
import EditSubCategory from "@/components/subCategory/EditSubCategory";
import ProtectedRoute from "./ProtectedRoute";
import BlogPage from "@/pages/blog/blog";
import CategoryPage from "@/pages/category/Category";

const AppRoutes = () => {
  return (
    <Routes>
      {/* You can add login page routes here in the future */}
      <Route path="/" element={<LoginPage />} />

      {/* This makes DashboardLayout a parent route for all dashboard pages */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Add your child routes for the dashboard here */}
        <Route path="category" element={<CategoryPage />} />
        <Route path="category/addCategory" element={<AddCategory />} />
        <Route path="category/edit/:id" element={<EditCategory />} />
        <Route
          path="category/:id"
          element={<SubCategoryPage title="Sub Category" />}
        />
        <Route
          path="category/:id/create-subcategory"
          element={<AddSubCategory />}
        />
        <Route
          path="category/:id/edit-subcategory/:subCategoryId"
          element={<EditSubCategory />}
        />
        <Route path="category/search" element={<CategorySearchPage />} />

        <Route path="blogs" element={<BlogPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
