import { Loader } from "lucide-react";
import { Card } from "../ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { categoryApi } from "@/apis/api-call";

type Category = {
  id: string;
  title: string;
  // Add other fields if needed
};

const CategorySearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchQuery = searchParams.get("search") || "";
  const [results, setResults] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    setLoading(true);
    categoryApi
      .getAllCategories()
      .then((data) => {
        console.log("Full response from getAllCategories:", data);
        // Try to find the correct property
        const categories =
          data.categories || data.data?.categories || data.data || [];
        const filtered = categories.filter(
          (cat: Category) =>
            typeof cat.title === "string" &&
            cat.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        console.log(
          "Filtered results:",
          filtered,
          "Search query:",
          searchQuery
        );
        setResults(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setResults([]);
        setLoading(false);
      });
  }, [searchQuery]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Search Categories</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : results.length === 0 && searchQuery ? (
        <div className="text-gray-500">No categories found.</div>
      ) : (
        <div className="grid gap-4 max-w-2xl">
          {results.map((cat) => (
            <Card
              key={cat.id}
              className="p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => navigate(`/dashboard/category/${cat.id}`)}
            >
              <div className="font-semibold text-lg">{cat.title}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategorySearchPage;
