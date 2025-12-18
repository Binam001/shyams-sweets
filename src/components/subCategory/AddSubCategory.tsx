import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

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
import { subCategoryApi } from "@/apis/api-call"; // Adjust path as needed

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters." }),
  description: z
    .string()
    .min(2, { message: "Description must be at least 2 characters." }),
  coverImage: z.any().optional(),
});

type SubCategoryFormValues = z.infer<typeof formSchema>;

const AddSubCategory = ({
  id,
  onClose,
}: {
  id?: string;
  onClose?: () => void;
} = {}) => {
  const { id: categoryId } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

  // Use URL param or prop
  const catId = categoryId || id || "";

  const form = useForm<SubCategoryFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      slug: "",
      description: "",
    },
  });

  const onSubmit = async (values: SubCategoryFormValues) => {
    if (!catId) {
      toast.error("Category ID is missing");
      return;
    }

    if (!values.coverImage || values.coverImage.length === 0) {
      toast.error("Please select a cover image");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("description", values.description);
      // Append the file from the FileList
      if (values.coverImage && values.coverImage[0]) {
        formData.append("coverImage", values.coverImage[0]);
      }

      await subCategoryApi.createSubCategory(catId, formData);

      toast.success("Subcategory created successfully!");
      navigate(-1); // Returns to the previous SubCategory list page
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Failed to create subcategory.";
      toast.error(errorMsg);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Pass the FileList to React Hook Form
      form.setValue("coverImage", event.target.files);
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Add New Sub Category</h2>
      {/* <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add Sub Category</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div> */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-md"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Sub Category Title"
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
                  <Input placeholder="sub-category-slug" {...field} />
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
                  <Input
                    placeholder="Brief description of the subcategory"
                    {...field}
                  />
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
                      alt="Preview"
                      className="h-40 w-full object-cover rounded-md border"
                    />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitting ? "Creating..." : "Create Sub Category"}
          </Button>
          
          {/* Debug: Show form errors */}
          {Object.keys(form.formState.errors).length > 0 && (
            <div className="text-red-500 text-sm">
              {Object.entries(form.formState.errors).map(([key, error]) => (
                <p key={key}>{key}: {error?.message as string}</p>
              ))}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddSubCategory;
