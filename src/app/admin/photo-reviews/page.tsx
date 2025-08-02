'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PhotoReview {
  _id: string;
  cakeName: string;
  cakeDescription: string;
  totalPrice: number;
  totalWeight: number;
  images: string[];
  completedDate: string;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminPhotoReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<PhotoReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<PhotoReview | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cakeName: '',
    cakeDescription: '',
    totalPrice: '',
    totalWeight: '',
    completedDate: '',
    images: [] as string[],
    isApproved: true
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchReviews();
    }
  }, [status, session, router]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/photo-reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching photo reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);

      // Створюємо URL для попереднього перегляду
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPreviewUrls(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Змінюємо порядок файлів
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    const draggedFile = newFiles[draggedIndex];
    const draggedPreview = newPreviews[draggedIndex];

    newFiles.splice(draggedIndex, 1);
    newPreviews.splice(draggedIndex, 1);

    newFiles.splice(dropIndex, 0, draggedFile);
    newPreviews.splice(dropIndex, 0, draggedPreview);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    setDraggedIndex(null);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    const uploadPromises = selectedFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'reviews'); // Specify content type

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const data = await response.json();
      return data.url;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrls: string[] = [];

      // Якщо є вибрані файли, завантажуємо їх
      if (selectedFiles.length > 0) {
        imageUrls = await uploadImages();
      } else if (editingReview) {
        // Якщо редагуємо без нових файлів, використовуємо існуючі зображення
        imageUrls = editingReview.images;
      }

      // Валідація: має бути хоча б одне зображення
      if (imageUrls.length === 0) {
        alert('Будь ласка, додайте хоча б одну фотографію торту');
        return;
      }

      const reviewData = {
        ...formData,
        images: imageUrls,
        totalPrice: Number(formData.totalPrice),
        totalWeight: Number(formData.totalWeight),
        completedDate: new Date(formData.completedDate)
      };

      let response;
      if (editingReview) {
        response = await fetch(`/api/photo-reviews/${editingReview._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData),
        });
      } else {
        response = await fetch('/api/photo-reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData),
        });
      }

      if (response.ok) {
        fetchReviews();
        resetForm();
        alert(editingReview ? 'Відгук оновлено!' : 'Відгук додано!');
      } else {
        const error = await response.json();
        alert(error.error || 'Помилка збереження відгуку');
      }
    } catch (error) {
      console.error('Error saving photo review:', error);
      alert('Помилка збереження відгуку');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review: PhotoReview) => {
    setEditingReview(review);
    setFormData({
      cakeName: review.cakeName,
      cakeDescription: review.cakeDescription,
      totalPrice: review.totalPrice.toString(),
      totalWeight: review.totalWeight.toString(),
      completedDate: review.completedDate ? review.completedDate.split('T')[0] : '',
      images: review.images,
      isApproved: review.isApproved
    });
    // Очищуємо вибрані файли при редагуванні
    setSelectedFiles([]);
    setPreviewUrls([]);

    // Прокручуємо до форми
    const formElement = document.getElementById('review-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цей відгук?')) return;

    try {
      const response = await fetch(`/api/photo-reviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchReviews();
        alert('Відгук видалено!');
      } else {
        alert('Помилка видалення відгуку');
      }
    } catch (error) {
      console.error('Error deleting photo review:', error);
      alert('Помилка видалення відгуку');
    }
  };

  const toggleApproval = async (review: PhotoReview) => {
    try {
      const response = await fetch(`/api/photo-reviews/${review._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !review.isApproved }),
      });

      if (response.ok) {
        fetchReviews();
      }
    } catch (error) {
      console.error('Error toggling approval:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      cakeName: '',
      cakeDescription: '',
      totalPrice: '',
      totalWeight: '',
      completedDate: '',
      images: [],
      isApproved: true
    });
    setSelectedFiles([]);
    setPreviewUrls([]);
    setDraggedIndex(null);
    setEditingReview(null);
  };

  const formatPrice = (price: number) => {
    return `${Math.round(price)} ₴`;
  };

  const formatWeight = (weight: number) => {
    return `${weight.toFixed(1)} кг`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
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
                <h1 className="text-2xl font-bold text-gray-900">Фото-відгуки</h1>
                <p className="text-gray-600 mt-1">Управління відгуками з фотографіями тортів</p>
              </div>
            </div>
          </div>
        </div>

        {/* Форма додавання/редагування */}
        <div id="review-form" className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {editingReview ? 'Редагувати відгук' : 'Додати новий відгук'}
            </h2>
            {editingReview && (
              <button
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Скасувати редагування</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Назва торту *
              </label>
              <input
                type="text"
                value={formData.cakeName}
                onChange={(e) => setFormData({ ...formData, cakeName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Введіть назву торту"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Загальна ціна *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.totalPrice}
                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-12"
                    placeholder="0"
                    required
                  />
                  <span className="absolute right-3 top-3 text-gray-500">₴</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Загальна вага *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.totalWeight}
                    onChange={(e) => setFormData({ ...formData, totalWeight: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-12"
                    placeholder="0.0"
                    required
                  />
                  <span className="absolute right-3 top-3 text-gray-500">кг</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Опис торта *
              </label>
              <textarea
                value={formData.cakeDescription}
                onChange={(e) => setFormData({ ...formData, cakeDescription: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Детальний опис торта (смак, декор, особливості...)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата виконання замовлення *
              </label>
              <input
                type="date"
                value={formData.completedDate}
                onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотографії торту *
              </label>

              {/* Завантаження файлів */}
              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Виберіть одну або декілька фотографій торту (JPG, PNG, WEBP)
                </p>
              </div>

              {/* Попередній перегляд нових файлів */}
              {previewUrls.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Нові фотографії: (перетягніть для зміни порядку)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {previewUrls.map((url, index) => (
                      <div
                        key={index}
                        className={`relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-move transition-opacity ${draggedIndex === index ? 'opacity-50' : ''
                          }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        <Image
                          src={url}
                          alt={`Попередній перегляд ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Перший номер буде головною фотографією в слайдері
                  </p>
                </div>
              )}

              {/* Існуючі зображення при редагуванні */}
              {editingReview && editingReview.images.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Поточні фотографії:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {editingReview.images.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Поточне фото ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Додайте нові фотографії вище, щоб замінити поточні
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <span className="text-sm font-medium text-gray-700">Схвалений для публікації</span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              {editingReview && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Скасувати
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {submitting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                <span>{submitting ? (editingReview ? 'Оновлюємо...' : 'Додаємо...') : (editingReview ? 'Оновити відгук' : 'Додати відгук')}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Список відгуків */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Усі відгуки ({reviews.length})</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h6a2 2 0 002-2V8M9 12h6" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Відгуків поки немає</h3>
                <p className="mt-1 text-sm text-gray-500">Додайте перший відгук використовуючи форму вище</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{review.cakeName}</h3>
                        <span className="text-pink-600 font-bold">
                          {formatPrice(review.totalPrice)} / {formatWeight(review.totalWeight)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${review.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {review.isApproved ? 'Схвалено' : 'Не схвалено'}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{review.cakeDescription}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>Дата виконання: {new Date(review.completedDate).toLocaleDateString('uk-UA')}</div>
                        <div>Створено: {new Date(review.createdAt).toLocaleDateString('uk-UA')}</div>
                      </div>
                    </div>
                  </div>

                  {/* Images Grid */}
                  {review.images.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {review.images.map((image, index) => (
                          <div key={index} className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`Торт ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => toggleApproval(review)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${review.isApproved
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                    >
                      {review.isApproved ? 'Відхилити' : 'Схвалити'}
                    </button>

                    <button
                      onClick={() => handleEdit(review)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors"
                    >
                      Редагувати
                    </button>

                    <button
                      onClick={() => handleDelete(review._id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
