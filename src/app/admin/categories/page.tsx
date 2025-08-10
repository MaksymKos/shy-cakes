"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ICategory, CreateCategoryInput, UpdateCategoryInput, validateCategory, validateUpdateCategory } from "@/models/Category";

export default function CategoriesAdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState<CreateCategoryInput>({
    name: "",
    description: "",
    order: 0,
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.sort((a: ICategory, b: ICategory) => a.order - b.order));
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Помилка завантаження категорій");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    try {
      setError(null);

      const validation = validateCategory(newCategory);
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add category");
      }

      setNewCategory({
        name: "",
        description: "",
        order: Math.max(...categories.map(c => c.order), 0) + 1,
        isActive: true,
      });
      await fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
      setError(error instanceof Error ? error.message : "Помилка додавання категорії");
    }
  };

  const handleEditCategory = async (id: string, updatedData: UpdateCategoryInput) => {
    try {
      setError(null);

      const validation = validateUpdateCategory(updatedData);
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update category");
      }

      setEditingId(null);
      await fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      setError(error instanceof Error ? error.message : "Помилка оновлення категорії");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю категорію?")) {
      return;
    }

    try {
      setError(null);
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(error instanceof Error ? error.message : "Помилка видалення категорії");
    }
  };

  const startEdit = (category: ICategory) => {
    setEditingId(category._id as string);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-center">Завантаження...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              ← Назад до панелі
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Управління категоріями
            </h1>
          </div>
        </div>

        {}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Додати нову категорію
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Назва категорії"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              placeholder="Опис категорії"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              type="number"
              value={newCategory.order}
              onChange={(e) =>
                setNewCategory({ ...newCategory, order: parseInt(e.target.value) || 0 })
              }
              placeholder="Порядок сортування"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={newCategory.isActive}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, isActive: e.target.checked })
                  }
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm text-gray-700">Активна</span>
              </label>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              >
                Додати
              </button>
            </div>
          </div>
        </div>

        {}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Існуючі категорії ({categories.length})
            </h2>

            {categories.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Категорії відсутні
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <CategoryItem
                    key={category._id as string}
                    category={category}
                    isEditing={editingId === category._id}
                    onEdit={(updatedData) => handleEditCategory(category._id as string, updatedData)}
                    onDelete={() => handleDeleteCategory(category._id as string)}
                    onStartEdit={() => startEdit(category)}
                    onCancelEdit={cancelEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryItemProps {
  category: ICategory;
  isEditing: boolean;
  onEdit: (data: UpdateCategoryInput) => void;
  onDelete: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

function CategoryItem({
  category,
  isEditing,
  onEdit,
  onDelete,
  onStartEdit,
  onCancelEdit,
}: CategoryItemProps) {
  const [editData, setEditData] = useState<UpdateCategoryInput>({
    name: category.name,
    description: category.description || "",
    order: category.order,
    isActive: category.isActive,
  });

  useEffect(() => {
    if (isEditing) {
      setEditData({
        name: category.name,
        description: category.description || "",
        order: category.order,
        isActive: category.isActive,
      });
    }
  }, [isEditing, category]);

  if (isEditing) {
    return (
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="text"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <input
            type="number"
            value={editData.order}
            onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) || 0 })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={editData.isActive}
              onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-gray-700">Активна</span>
          </label>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(editData)}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
          >
            Зберегти
          </button>
          <button
            onClick={onCancelEdit}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
          >
            Скасувати
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="font-medium text-gray-900">{category.name}</div>
            <div className="text-sm text-gray-500">Назва</div>
          </div>
          <div>
            <div className="text-gray-700">{category.description || "—"}</div>
            <div className="text-sm text-gray-500">Опис</div>
          </div>
          <div>
            <div className="text-gray-700">{category.order}</div>
            <div className="text-sm text-gray-500">Порядок</div>
          </div>
          <div>
            <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${category.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
              }`}>
              {category.isActive ? "Активна" : "Неактивна"}
            </div>
            <div className="text-sm text-gray-500 mt-1">Статус</div>
          </div>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={onStartEdit}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Редагувати
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Видалити
          </button>
        </div>
      </div>
    </div>
  );
}
