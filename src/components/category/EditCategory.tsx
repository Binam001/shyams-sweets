import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { categoryApi } from "@/apis/api-call";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  slug: z.string().min(2, {
    message: "Slug must be at least 2 characters.",
  }),
  coverImage: z.any().optional(), // File object, handled separately
});

type CategoryFormValues = z.infer<typeof formSchema>;

const EditCategory = () => {
  const { id: categoryId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      coverImage: undefined,
    },
  });

  useEffect(() => {
    if (!categoryId) {
      toast.error("Category ID is missing.");
      navigate("/dashboard/category");
      return;
    }

    const fetchCategory = async () => {
      setLoading(true);
      try {
        const response = await categoryApi.getCategoryById(categoryId);
        const category = response.data.category; // Assuming data is nested under 'category'
        form.reset({
          title: category.title,
          slug: category.slug || "",
          coverImage: undefined, // Reset file input
        });
        setCoverImagePreview(category.coverImage);
      } catch (error) {
        toast.error("Failed to fetch category data.");
        console.error("Failed to fetch category:", error);
        navigate("/dashboard/category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId, navigate, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    if (!categoryId) {
      toast.error("Category ID is missing for update.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("slug", values.slug);

      // Only append new file if selected
      if (values.coverImage && values.coverImage instanceof FileList) {
        formData.append("coverImage", values.coverImage[0]);
      } else if (typeof values.coverImage === "string") {
        // If coverImage is still a string, it means no new file was selected,
        // and it's the old URL. We don't need to re-upload it.
        // Or if we want to explicitly send the old image URL, we can append it.
        // For now, assuming if no new file, we don't send this field in FormData.
      }

      await categoryApi.updateCategory(categoryId, formData);
      toast.success("Category updated successfully!");
      navigate("/dashboard/category"); // Navigate back to the category list
    } catch (error) {
      toast.error("Failed to update category.");
      console.error("Failed to update category:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("coverImage", event.target.files); // Set the FileList to form value
    } else {
      setCoverImagePreview(null);
      form.setValue("coverImage", undefined);
    }
  };

  const handleTitleChange = (value: string) => {
    // Auto-generate slug from title
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen

    form.setValue("title", value);
    form.setValue("slug", slug);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Category</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category title"
                    {...field}
                    onChange={(e) => handleTitleChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={() => (
              <FormItem>
                <FormLabel>Cover Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </FormControl>
                {coverImagePreview && (
                  <div className="mt-4">
                    <img
                      src={coverImagePreview}
                      alt="Cover Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Update Category
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditCategory;
