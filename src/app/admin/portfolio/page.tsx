'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface PortfolioItem {
  _id: string;
  title: string;
  image: string;
  createdAt: string;
}

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
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
  });

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data);
      } else {
        toast.error('Помилка завантаження портфоліо');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Помилка завантаження портфоліо');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.image) {
      toast.warning('Заповніть всі поля');
      return;
    }

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ title: '', image: '' });
        fetchPortfolioItems();
        toast.success('Елемент портфоліо успішно створено');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Помилка створення елементу портфоліо');
      }
    } catch (error) {
      console.error('Create error:', error);
      toast.error('Помилка створення елементу портфоліо');
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem || !editingItem.title.trim() || !editingItem.image) {
      toast.warning('Заповніть всі поля');
      return;
    }

    try {
      const response = await fetch(`/api/portfolio/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editingItem.title,
          image: editingItem.image
        }),
      });

      if (response.ok) {
        setEditingItem(null);
        fetchPortfolioItems();
        toast.success('Елемент портфоліо успішно оновлено');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Помилка оновлення елементу портфоліо');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Помилка оновлення елементу портфоліо');
    }
  };

  const handleDeleteItem = async (id: string) => {
    // Показуємо попередження через toast
    toast.warning('Натисніть ще раз для підтвердження видалення', {
      onClick: () => confirmDeleteItem(id),
      autoClose: 5000,
    });
  };

  const confirmDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPortfolioItems();
        toast.success('Елемент портфоліо успішно видалено');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Помилка видалення елементу портфоліо');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Помилка видалення елементу портфоліо');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm sm:text-base">Назад до панелі</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Управління портфоліо</h1>
            </div>
          </div>
        </div>

        {/* Форма додавання */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Додати нову роботу</h2>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Назва роботи</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Введіть назву роботи"
                required
              />
            </div>

            <div>
              <ImageUpload
                onImageUpload={(url) => setFormData({ ...formData, image: url })}
                currentImage={formData.image}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
              >
                Додати роботу
              </button>
            </div>
          </form>
        </div>
        {editingItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Редагувати роботу</h3>
              <form onSubmit={handleEditItem} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Назва роботи
                  </label>
                  <input
                    type="text"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Введіть назву роботи"
                    required
                  />
                </div>

                <ImageUpload
                  onImageUpload={(url) => setEditingItem({ ...editingItem, image: url })}
                  currentImage={editingItem.image}
                />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Зберегти
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}      {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <p className="mt-2 text-gray-600">Завантаження...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {portfolioItems.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-24 sm:h-32">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-2 sm:p-3">
                  <h3 className="font-medium text-gray-900 mb-1 text-xs sm:text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 mb-2 sm:mb-3">
                    {new Date(item.createdAt).toLocaleDateString('uk-UA')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded text-xs transition-colors"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-xs transition-colors"
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
          </div>
        )}
      </div>
    </div>
  );
}
