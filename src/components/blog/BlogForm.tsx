import { useEffect, useState } from "react";
import { useForm, type Control } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
import type { Blog } from "@/types/blog";
import { useCreateBlog, useUpdateBlog } from "@/hooks/useBlogs";
import { toast } from "react-toastify";
import RichTextEditor from "../RichTextEditor";

type BlogFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  estimatedReadTime: number;
  // isActive: boolean;
};

// Form validation rules
const defaultValues = {
  title: "",
  slug: "",
  excerpt: "",
  description: "",
  estimatedReadTime: 5,
  // isActive: true,
};

interface BlogFormProps {
  blog?: Blog;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BlogForm({ blog, onSuccess, onCancel }: BlogFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    blog?.coverImage || null
  );
  const [description, setDescription] = useState(blog?.description || "");

  const { mutate: updateBlog, isPending: isUpdatePending } = useUpdateBlog(
    blog?._id as string
  );

  const { mutate: addBlog, isPending: isAddPending } = useCreateBlog();

  const form = useForm<BlogFormValues>({
    defaultValues: blog
      ? {
          title: blog.title || "",
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          description: blog.description || "",
          estimatedReadTime: blog.estimatedReadTime || 5,
          // isActive: blog.isActive ?? true,
        }
      : defaultValues,
  });

  const { control } = form;

  // Reset form when blog prop changes
  useEffect(() => {
    if (blog) {
      form.reset({
        title: blog.title || "",
        description: blog.description || "",
        estimatedReadTime: blog.estimatedReadTime || 5,
        // isActive: blog.isActive ?? true,
      });
      setDescription(blog.description || "");
      setImagePreview(blog.coverImage || null);
    } else {
      form.reset(defaultValues);
      setDescription("");
      setImagePreview(null);
    }
    setImage(null);
  }, [blog, form]);

  useEffect(() => {
    form.setValue("description", description, { shouldValidate: true });
  }, [description, form]);

  const handleDescriptionChange = (content: string) => {
    setDescription(content);
  };

  const onSubmit = async (values: BlogFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("excerpt", values.excerpt);
      formData.append("description", description);
      formData.append("estimatedReadTime", values.estimatedReadTime.toString());
      // formData.append("isActive", values.isActive.toString());

      if (image) {
        formData.append("coverImage", image);
      }

      if (blog) {
        updateBlog(formData, {
          onSuccess: () => {
            toast(`Blog updated successfully`);
            onSuccess();
          },
          onError: () => {
            toast(`Failed to update blog`);
          },
        });
      } else {
        addBlog(formData, {
          onSuccess: () => {
            toast(`Blog created successfully`);
            onSuccess();
          },
          onError: () => {
            toast(`Failed to create blog`);
          },
        });
      }
    } catch (error) {
      toast(`Failed to ${blog ? "update" : "create"} blog`);
    }
  };

  return (
    <div className="mt-10 mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-white/10 p-6 rounded-sm border-black/5 border"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title Field */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter blog title"
                      {...field}
                      className="rounded-sm border-gray-300 focus:ring-2 focus:ring-[#262262]"
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
                    <Input placeholder="category-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Estimated Read Time */}
            <FormField
              control={control}
              name="estimatedReadTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Estimated Read Time (minutes)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="5"
                      value={field.value}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 1)
                      }
                      className="rounded-sm border-gray-300 focus:ring-2 focus:ring-[#262262]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Active Toggle */}
            {/* <FormField
              control={control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-[#262262] focus:ring-[#262262]"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Is Active
                    </FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>

          {/* coverimage Upload */}
          <FormItem className="flex flex-col justify-end">
            <FormLabel className="text-sm font-medium text-gray-700">
              Cover Image (480 × 370)
            </FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  setImage(e.target.files?.[0] || null);
                  setImagePreview(
                    e.target.files?.[0]
                      ? URL.createObjectURL(e.target.files[0])
                      : null
                  );
                }}
                className="cursor-pointer rounded-sm border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-[2px] file:border-0 file:bg-[#262262]/10 file:text-[#262262] hover:file:bg-[#262262]/20"
              />
            </FormControl>
            <p className="text-xs text-red-500 mt-1 font-medium">
              File size limit: 3MB
            </p>
            <FormMessage />
          </FormItem>

          {/* Image Preview */}
          {imagePreview && (
            <div className="flex justify-start">
              <img
                src={imagePreview}
                alt="Cover Image preview"
                width={200}
                height={200}
                className="w-48 h-36 object-cover rounded-[2px] shadow-sm border border-gray-200"
              />
            </div>
          )}

          {/* Rich Text Editor */}
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Description
            </FormLabel>
            <FormControl>
              <RichTextEditor
                initialContent={description}
                onChange={handleDescriptionChange}
                placeholder="Write your blog content here..."
              />
            </FormControl>
            <FormMessage>
              {form.formState.errors.description?.message}
            </FormMessage>
          </FormItem>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="rounded-sm border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-sm bg-[#262262] hover:bg-[#1a1a4a] text-white"
              disabled={isAddPending || isUpdatePending}
            >
              {blog ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
