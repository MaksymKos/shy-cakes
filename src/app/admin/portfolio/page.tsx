'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
        onImageUpload(data.url);
      } else {
        alert('Помилка завантаження файлу');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Помилка завантаження файлу');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Зображення
      </label>

      {currentImage && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
          <Image
            src={currentImage}
            alt="Preview"
            fill
            className="object-cover"
          />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
      />

      {uploading && (
        <p className="text-sm text-gray-500">Завантаження...</p>
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
      }
    } catch (error) {
      console.error('Fetch error:', error);
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
      alert('Заповніть всі поля');
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
      } else {
        const error = await response.json();
        alert(error.error || 'Помилка створення елементу портфоліо');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Помилка створення елементу портфоліо');
    }
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingItem || !editingItem.title.trim() || !editingItem.image) {
      alert('Заповніть всі поля');
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
      } else {
        const error = await response.json();
        alert(error.error || 'Помилка оновлення елементу портфоліо');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Помилка оновлення елементу портфоліо');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей елемент?')) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPortfolioItems();
      } else {
        alert('Помилка видалення елементу портфоліо');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Помилка видалення елементу портфоліо');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
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
        <h1 className="text-3xl font-bold text-gray-900">Управління портфоліо</h1>
      </div>

      {/* Форма додавання */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Додати нову роботу</h2>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg transition-colors"
            >
              Додати роботу
            </button>
          </div>
        </form>
      </div>
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
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

              <div className="flex gap-3">
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
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-gray-600">Завантаження...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {portfolioItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-32">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-900 mb-1 text-sm line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  {new Date(item.createdAt).toLocaleDateString('uk-UA')}
                </p>
                <div className="flex gap-2">
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
      )}

      {!loading && portfolioItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Портфоліо порожнє</p>
          <p className="text-gray-400 mt-2">Додайте першу роботу</p>
        </div>
      )}
    </div>
  );
}
