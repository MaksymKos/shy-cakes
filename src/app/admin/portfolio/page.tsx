'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { usePortfolio, usePortfolioStore } from '@/store';
import type { PortfolioItem } from '@/types/database';

interface ImageUploadProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
}

function ImageUpload({ onImageUpload, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Тільки файли JPG, PNG, WEBP дозволені');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Файл занадто великий. Максимум 5MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'portfolio'); // Specify content type

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Use secure_url if available, fallback to url
        const imageUrl = data.secure_url || data.url;
        onImageUpload(imageUrl);
        toast.success('Зображення успішно завантажено');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Помилка завантаження файлу');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Помилка завантаження файлу');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Зображення *
      </label>

      {currentImage && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Поточне зображення:</h4>
          <div className="relative group">
            <Image
              src={currentImage}
              alt="Preview"
              width={120}
              height={120}
              className="object-cover rounded-lg border-2 border-gray-200"
            />
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <p className="text-sm text-gray-500">
        Оберіть зображення роботи (JPG, PNG, WEBP, максимум 5MB)
      </p>

      {uploading && (
        <div className="flex items-center space-x-2 text-pink-600">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Завантаження зображення...</span>
        </div>
      )}
    </div>
  );
}

export default function PortfolioAdmin() {
  const router = useRouter();

  // Use Zustand store for portfolio management
  const {
    data: portfolioItems,
    isLoading: loading,
    error,
    clearError
  } = usePortfolio({
    autoFetch: true,
    refreshInterval: 2 * 60 * 1000 // Refresh every 2 minutes
  });

  const {
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
  } = usePortfolioStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
  });

  // Helper function to reset form
  const resetForm = () => {
    setFormData({
      title: '',
      image: '',
    });
  };

  // Clear any existing errors when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.image) {
      toast.warning('Заповніть всі поля');
      return;
    }

    setUploading(true);

    try {
      const result = await addPortfolioItem({
        title: formData.title,
        image: formData.image,
      });

      if (result) {
        resetForm();
        setShowAddForm(false);
        toast.success('Елемент портфоліо успішно створено');
      } else {
        toast.error('Помилка створення елементу портфоліо');
      }
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Помилка створення елементу портфоліо');
    } finally {
      setUploading(false);
    }
  };

  const handleEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      image: item.image,
    });
    setShowAddForm(true);

    // Scroll to top when editing
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem || !formData.title.trim() || !formData.image) {
      toast.warning('Заповніть всі поля');
      return;
    }

    setUploading(true);

    try {
      await updatePortfolioItem(editingItem._id?.toString() || '', {
        title: formData.title,
        image: formData.image,
      });

      setEditingItem(null);
      resetForm();
      setShowAddForm(false);
      toast.success('Елемент портфоліо успішно оновлено');
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Помилка оновлення елементу портфоліо');
    } finally {
      setUploading(false);
    }
  };

  const cancelEdit = () => {
    setEditingItem(null);
    resetForm();
    setShowAddForm(false);
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей елемент?')) {
      return;
    }

    try {
      await deletePortfolioItem(id);
      toast.success('Елемент портфоліо успішно видалено');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Помилка видалення елементу портфоліо');
    }
  };

  // Display error if any
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Помилка: {error}</p>
            <button
              onClick={clearError}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Спробувати ще раз
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0 bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm sm:text-base">Назад до панелі</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Управління портфоліо</h1>
              <p className="mt-2 text-gray-600 text-sm sm:text-base">Знайдено {portfolioItems.length} робіт</p>
            </div>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              resetForm();
              setShowAddForm(true);
            }}
            className="w-full sm:w-auto bg-pink-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors font-semibold cursor-pointer text-sm sm:text-base"
          >
            + Додати роботу
          </button>
        </div>

        {/* Add/Edit Portfolio Item Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingItem ? `Редагування: ${editingItem.title}` : 'Додати нову роботу'}
            </h2>
            <form onSubmit={editingItem ? handleUpdateItem : handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Назва роботи</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Введіть назву роботи"
                />
              </div>

              <div>
                <ImageUpload
                  onImageUpload={(url) => setFormData({ ...formData, image: url })}
                  currentImage={formData.image}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 transition-colors"
                >
                  {uploading ? 'Збереження...' : (editingItem ? 'Оновити роботу' : 'Додати роботу')}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Скасувати
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-2 text-gray-600">Завантаження...</p>
          </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            {portfolioItems.map((item) => (
              <div key={item._id?.toString()} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString('uk-UA') : 'No date'}
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id?.toString() || '')}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}      {!loading && portfolioItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Портфоліо порожнє</p>
            <p className="text-gray-400 mt-2">Додайте першу роботу</p>
            <button
              onClick={() => {
                setEditingItem(null);
                resetForm();
                setShowAddForm(true);
              }}
              className="mt-4 bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors cursor-pointer"
            >
              Додати першу роботу
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
