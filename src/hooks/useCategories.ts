import { useState, useEffect, useMemo } from "react";
import { ICategory } from "@/models/Category";

export interface CategoryOption {
  value: string;
  label: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch categories"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Convert to format compatible with old constants using useMemo for optimization
  const productCategories = useMemo((): CategoryOption[] => {
    return categories
      .filter((cat) => cat.isActive)
      .sort((a, b) => a.order - b.order)
      .map((cat) => ({
        value: cat.name,
        label: cat.name,
      }));
  }, [categories]);

  const filterCategories = useMemo((): CategoryOption[] => {
    return [{ value: "", label: "Всі товари" }, ...productCategories];
  }, [productCategories]);

  return {
    categories,
    productCategories,
    filterCategories,
    loading,
    error,
    refetch: () => {
      setCategories([]);
      setLoading(true);
      setError(null);
      // Trigger useEffect to refetch
      const fetchCategories = async () => {
        try {
          setLoading(true);
          const response = await fetch("/api/categories");
          if (!response.ok) {
            throw new Error("Failed to fetch categories");
          }
          const data = await response.json();
          setCategories(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch categories"
          );
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    },
  };
}
