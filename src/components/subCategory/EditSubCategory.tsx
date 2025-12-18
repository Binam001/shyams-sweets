import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { subCategoryApi } from "@/apis/api-call";
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
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  coverImage: z.any().optional(), // File object, handled separately
});

type SubCategoryFormValues = z.infer<typeof formSchema>;

const EditSubCategory = () => {
  const { id: categoryId, subCategoryId } = useParams<{
    id: string;
    subCategoryId: string;
  }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      coverImage: undefined,
    },
  });

  useEffect(() => {
    if (!subCategoryId) {
      toast.error("SubCategory ID is missing.");
      navigate(`/dashboard/category/${categoryId}`);
      return;
    }

    const fetchSubCategory = async () => {
      setLoading(true);
      try {
        const response = await subCategoryApi.getSubCategoryById(subCategoryId);
        const subCategory =
          response.data.subCategory || response.data.data || response.data;
        form.reset({
          title: subCategory.title,
          slug: subCategory.slug || "",
          description: subCategory.description || "",
          coverImage: undefined, // Reset file input
        });
        setCoverImagePreview(subCategory.coverImage);
      } catch (error) {
        toast.error("Failed to fetch subcategory data.");
        console.error("Failed to fetch subcategory:", error);
        navigate(`/dashboard/category/${categoryId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategory();
  }, [subCategoryId, categoryId, navigate, form]);

  const onSubmit = async (values: SubCategoryFormValues) => {
    if (!subCategoryId) {
      toast.error("SubCategory ID is missing for update.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("description", values.description);

      if (values.coverImage && values.coverImage instanceof FileList) {
        formData.append("coverImage", values.coverImage[0]);
      }

      await subCategoryApi.updateSubCategory(subCategoryId, formData);
      toast.success("SubCategory updated successfully!");
      navigate(`/dashboard/category/${categoryId}`); // Navigate back to the subcategory list
    } catch (error) {
      toast.error("Failed to update subcategory.");
      console.error("Failed to update subcategory:", error);
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
      <h1 className="text-3xl font-bold mb-6">Edit SubCategory</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SubCategory Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter subcategory title"
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
                  <Input placeholder="Enter subcategory slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subcategory description" {...field} />
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
            Update SubCategory
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditSubCategory;