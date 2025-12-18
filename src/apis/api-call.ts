import { api } from "@/services/api";

// ================== USER ==================
export const userApi = {
  register: (data: object) => api.post("/users/register", data),
  login: (data: object) => api.post("/users/login", data),
  logout: () => api.get("/users/logout"),
  getCurrent: () => api.get("/users/current"),
};

// ================= categories ================
export const categoryApi = {
  getAllCategories: (params?: { page?: number; limit?: number }) =>
    api.get("/category/get-all-categories", { params }).then((response) => {
      return response.data;
    }),
  getCategoryById: (id: string) => api.get(`/category/get-category/${id}`),
  createCategory: (data: FormData) =>
    api.post("/category/create-category", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteCategory: (id: string) => api.delete(`/category/delete-category/${id}`),
  updateCategory: (id: string, data: FormData) =>
    api.put(`/category/update-category/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// ======== sub categories ===============
export const subCategoryApi = {
  createSubCategory: (categoryId: string, data: FormData) => {
    data.append("categoryId", categoryId);
    return api.post(`/subcategory/create-subcategory`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAllSubCategories: (categoryId: string) =>
    api
      // .get(`/subcategory/get-all-subcategories`, {
      .get(`/subcategory/get-category-subcategories/${categoryId}`, {
        params: { categoryId },
      })
      .then((response) => response.data),
  getSubCategoryById: (id: string) =>
    api.get(`/subcategory/get-subcategory/${id}`),
  deleteSubCategory: (id: string) =>
    api.delete(`/subcategory/delete-subcategory/${id}`),
  updateSubCategory: (id: string, data: FormData) =>
    api.put(`/subcategory/update-subcategory/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

// ================== blog ==================
export const blogApi = {
  create: (data: object) =>
    api.post("/blog/create-blog", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (blogId: string, data: object) =>
    api.put(`/blog/update-blog/${blogId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getOne: (blogId: string) => api.get(`/blog/get-blog/${blogId}`),
  getAllBlogs: (params?: { page?: number; limit?: number }) =>
    api.get("/blog/get-all-blogs", { params }).then((response) => {
      return {
        data: response.data.data.blogs,
        pagination: {
          total: response.data.data.total,
          totalPages: response.data.data.totalPages,
          currentPage: response.data.data.page,
          itemsPerPage: response.data.data.limit,
          hasNextPage: response.data.data.page < response.data.data.totalPages,
          hasPreviousPage: response.data.data.page > 1,
          nextPage:
            response.data.data.page < response.data.data.totalPages
              ? response.data.data.page + 1
              : null,
          previousPage:
            response.data.data.page > 1 ? response.data.data.page - 1 : null,
        },
      };
    }),
  delete: (blogId: string) => api.delete(`/blog/delete-blog/${blogId}`),
};
