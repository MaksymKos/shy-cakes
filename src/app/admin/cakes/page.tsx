'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminCakesPage() {
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
    available: true
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || (session.user as { role?: string })?.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchProducts();
  }, [session, status, router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
        }),
      });

      if (response.ok) {
        setNewProduct({ name: '', description: '', price: '', category: '', available: true });
        setShowAddForm(false);
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Помилка збереження товару');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Помилка збереження товару');
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
      available: product.available
    });
    setShowAddForm(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setUploading(true);

    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
        }),
      });

      if (response.ok) {
        setEditingProduct(null);
        setNewProduct({ name: '', description: '', price: '', category: '', available: true });
        setShowAddForm(false);
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Помилка оновлення товару');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Помилка оновлення товару');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей товар?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Помилка видалення товару');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Помилка видалення товару');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!session || (session.user as { role?: string })?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">🎂 Управління товарами</h1>
            <p className="mt-2 text-gray-600">Знайдено {products.length} товарів</p>
          </div>

          <button
            onClick={() => setShowAddForm(true)}
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
                  >
                    <option value="">Оберіть категорію</option>
                    <option value="торти">Торти</option>
                    <option value="десерти">Десерти</option>
                    <option value="випічка">Випічка</option>
                    <option value="напої">Напої</option>
                    <option value="інше">Інше</option>
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
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.available}
                      onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
                      className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 cursor-pointer"
                    />
                    <span className="ml-2 text-sm text-gray-700">Доступний для замовлення</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploading ? 'Збереження...' : (editingProduct ? 'Оновити товар' : 'Додати товар')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                    setNewProduct({ name: '', description: '', price: '', category: '', available: true });
                  }}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
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
            <div key={product._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-default">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <span className={`px-2 py-1 text-xs rounded ${product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.available ? 'Доступний' : 'Недоступний'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
              <p className="text-pink-600 font-bold text-xl mb-2">{product.price} грн</p>
              <p className="text-sm text-gray-500 mb-4">Категорія: {product.category}</p>

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
