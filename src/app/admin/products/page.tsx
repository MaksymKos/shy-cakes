'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { PRODUCT_CATEGORIES, ProductCategoryValue } from '@/constants/categories';
import { PRODUCT_UNITS, UNIT_LABELS, type ProductUnit } from '@/constants/units';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategoryValue;
  available: boolean;
  unit: ProductUnit;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    unit: 'kg' as ProductUnit,
    available: true
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Helper function to reset form
  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      unit: 'kg' as ProductUnit,
      available: true
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
  };

  useEffect(() => {
    if (status === 'loading') return; // Чекаємо завантаження сесії

    // Додаткова затримка для надійності
    const timer = setTimeout(() => {
      if (status === 'unauthenticated' || !session) {
        router.push('/auth/signin');
        return;
      }

      // Перевіряємо роль тільки після того, як сесія точно завантажена
      if (session && (session.user as { role?: string })?.role !== 'admin') {
        router.push('/auth/signin');
        return;
      }

      // Завантажуємо продукти тільки для адмінів
      if (session && (session.user as { role?: string })?.role === 'admin') {
        fetchProducts();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast.error('Помилка завантаження товарів');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Помилка завантаження товарів');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);

    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'products'); // Specify content type

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      }
      throw new Error('Upload failed');
    });

    return Promise.all(uploadPromises);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload images first (only if files are selected)
      let imageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages();
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseInt(newProduct.price),
          images: imageUrls
        }),
      });

      if (response.ok) {
        resetForm();
        setShowAddForm(false);
        fetchProducts();
        toast.success('Товар успішно додано');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Помилка збереження товару');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Помилка збереження товару');
    } finally {
      setUploading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      unit: product.unit || 'kg',
      available: product.available
    });
    setPreviewUrls(product.images || []);
    setSelectedFiles([]);
    setShowAddForm(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setUploading(true);

    try {
      // Upload new images if selected
      let imageUrls: string[] = editingProduct.images || [];
      if (selectedFiles.length > 0) {
        const newImageUrls = await uploadImages();
        imageUrls = [...imageUrls, ...newImageUrls];
      }

      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseInt(newProduct.price),
          images: imageUrls
        }),
      });

      if (response.ok) {
        setEditingProduct(null);
        resetForm();
        setShowAddForm(false);
        fetchProducts();
        toast.success('Товар успішно оновлено');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Помилка оновлення товару');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Помилка оновлення товару');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    // Показуємо попередження через toast
    toast.warning('Натисніть ще раз для підтвердження видалення товару', {
      onClick: () => confirmDeleteProduct(productId),
      autoClose: 5000,
    });
  };

  const confirmDeleteProduct = async (productId: string) => {

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
        toast.success('Товар успішно видалено');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Помилка видалення товару');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Помилка видалення товару');
    }
  };

  const removeImage = (index: number) => {
    if (editingProduct && editingProduct.images) {
      const newImages = [...editingProduct.images];
      newImages.splice(index, 1);
      setEditingProduct({ ...editingProduct, images: newImages });

      // Update preview URLs
      const newPreviewUrls = [...previewUrls];
      newPreviewUrls.splice(index, 1);
      setPreviewUrls(newPreviewUrls);
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    resetForm();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  // Якщо не авторизований або не адмін - не показуємо нічого (useEffect перенаправить)
  if (status === 'unauthenticated' || !session || (session.user as { role?: string })?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Перевірка доступу...</p>
        </div>
      </div>
    );
  }

  // Показуємо контент тільки для авторизованих адмінів
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження товарів...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Назад до панелі</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-3xl font-bold">📦 Управління товарами</h1>
              <p className="mt-2 text-gray-600">Знайдено {products.length} товарів</p>
            </div>
          </div>

          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingProduct(null);
              cancelEdit();
            }}
            className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold cursor-pointer"
          >
            + Додати товар
          </button>
        </div>

        {/* Add/Edit Product Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? `Редагування: ${editingProduct.name}` : 'Додати новий товар'}
            </h2>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Назва товару</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Введіть назву товару"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
                  <select
                    required
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Оберіть категорію</option>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Одиниця виміру</label>
                  <select
                    required
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value as ProductUnit })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value={PRODUCT_UNITS.KG}>{UNIT_LABELS[PRODUCT_UNITS.KG].full} ({UNIT_LABELS[PRODUCT_UNITS.KG].short})</option>
                    <option value={PRODUCT_UNITS.PIECE}>{UNIT_LABELS[PRODUCT_UNITS.PIECE].full} ({UNIT_LABELS[PRODUCT_UNITS.PIECE].short})</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Детальний опис товару"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ціна (грн)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newProduct.available}
                      onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
                      className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Доступний для замовлення</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фото товару
                </label>

                {/* Existing Images (for edit mode) */}
                {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Поточні зображення:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {editingProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={image}
                            alt={`Product ${index + 1}`}
                            width={120}
                            height={120}
                            className="object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                />

                {/* New Images Preview */}
                {previewUrls.length > 0 && !editingProduct && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Попередній перегляд:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {previewUrls.map((url, index) => (
                        <Image
                          key={index}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          width={120}
                          height={120}
                          className="object-cover rounded-lg border-2 border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 transition-colors"
                >
                  {uploading ? 'Збереження...' : (editingProduct ? 'Оновити товар' : 'Додати товар')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    cancelEdit();
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
              {/* Product Image */}
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.available ? 'Доступний' : 'Недоступний'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="mb-2">
                  <p className="text-pink-600 font-bold text-xl">
                    {Math.round(product.price)} ₴ {product.unit ? UNIT_LABELS[product.unit]?.perUnit : '/ кг'}
                  </p>
                </div>
                <div className="text-sm text-gray-500 mb-4 space-y-1">
                  <p>📂 Категорія: {product.category}</p>
                  <p>📏 Одиниця: {product.unit ? UNIT_LABELS[product.unit]?.full : 'кілограм'} ({product.unit ? UNIT_LABELS[product.unit]?.short : 'кг'})</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="bg-red-600 text-white text-sm px-3 py-2 rounded hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center mt-12">
            <p className="text-gray-500">Товари не знайдено</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
            >
              Додати перший товар
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
