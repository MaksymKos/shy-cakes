'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { usePhotoReviewsStore } from '@/store/photoReviewsStore';
import type { PhotoReview } from '@/types/database';

export default function AdminPhotoReviewsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    photoReviews: reviews,
    isLoading: loading,
    fetchPhotoReviews,
    addPhotoReview,
    updatePhotoReview,
    deletePhotoReview
  } = usePhotoReviewsStore();
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
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showForm, setShowForm] = useState(false);

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
      fetchPhotoReviews();
    }
  }, [status, session, router, fetchPhotoReviews]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      // Validate files before adding
      const validFiles = fileArray.filter(file => {
        // Check file type
        if (!file.type.startsWith('image/')) {
          toast.error(`Файл ${file.name} не є зображенням`);
          return false;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Файл ${file.name} занадто великий. Максимум 5MB`);
          return false;
        }

        return true;
      });

      if (validFiles.length === 0) return;

      // Create preview URLs for all valid files
      const newPreviewUrls: string[] = [];
      let loadedCount = 0;

      const processFile = (file: File, index: number) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            newPreviewUrls[index] = event.target.result as string;
            loadedCount++;

            // When all files are loaded, update state
            if (loadedCount === validFiles.length) {
              setSelectedFiles(prev => [...prev, ...validFiles]);
              setPreviewUrls(prev => [...prev, ...newPreviewUrls]);

              if (validFiles.length !== fileArray.length) {
                toast.warning(`Додано ${validFiles.length} з ${fileArray.length} файлів`);
              } else {
                toast.success(`Додано ${validFiles.length} файлів для завантаження`);
              }
            }
          }
        };
        reader.readAsDataURL(file);
      };

      validFiles.forEach(processFile);
    }
  };

  const removeExistingImage = (index: number) => {
    if (editingReview && editingReview.images) {
      const newImages = [...editingReview.images];
      newImages.splice(index, 1);
      setEditingReview({ ...editingReview, images: newImages });
    }
  };

  const moveExistingImage = (fromIndex: number, toIndex: number) => {
    if (editingReview && editingReview.images) {
      const newImages = [...editingReview.images];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      setEditingReview({ ...editingReview, images: newImages });
    }
  };

  const movePreviewImage = (fromIndex: number, toIndex: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    const [movedFile] = newFiles.splice(fromIndex, 1);
    const [movedPreview] = newPreviews.splice(fromIndex, 1);

    newFiles.splice(toIndex, 0, movedFile);
    newPreviews.splice(toIndex, 0, movedPreview);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    setUploadingImages(true);
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', 'reviews'); // Specify content type

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(`Failed to upload ${file.name}: ${errorData.error}`);
        }

        const data = await response.json();
        return data.secure_url; // Fix: use secure_url instead of url
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      toast.success(`Завантажено ${uploadedUrls.length} зображень на сервер`);
      return uploadedUrls;
    } catch (error) {
      toast.error('Помилка завантаження зображень');
      throw error;
    } finally {
      setUploadingImages(false);
    }
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
        toast.warning('Будь ласка, додайте хоча б одну фотографію торту');
        return;
      }

      const reviewData = {
        ...formData,
        images: imageUrls,
        totalPrice: Number(formData.totalPrice),
        totalWeight: Number(formData.totalWeight),
        completedDate: new Date(formData.completedDate)
      };

      if (editingReview) {
        await updatePhotoReview(editingReview._id?.toString() || '', reviewData);
        toast.success('Відгук оновлено!');
      } else {
        await addPhotoReview(reviewData);
        toast.success('Відгук додано!');
      }

      resetForm(); // Це вже закриє форму завдяки setShowForm(false) в resetForm
    } catch (error) {
      console.error('Error saving review:', error);
      toast.error('Помилка збереження відгуку');
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
      completedDate: review.completedDate ? new Date(review.completedDate).toISOString().split('T')[0] : '',
      images: review.images,
      isApproved: review.isApproved
    });
    // Очищуємо вибрані файли при редагуванні
    setSelectedFiles([]);
    setPreviewUrls([]);

    // Відкриваємо форму
    setShowForm(true);

    // Прокручуємо до форми
    const formElement = document.getElementById('review-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id: string) => {
    // Показуємо попередження через toast
    toast.warning('Натисніть ще раз для підтвердження видалення відгуку', {
      onClick: () => confirmDeleteReview(id),
      autoClose: 5000,
    });
  };

  const confirmDeleteReview = async (id: string) => {
    try {
      await deletePhotoReview(id);
      toast.success('Відгук видалено!');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Помилка видалення відгуку');
    }
  };

  const resetForm = () => {
    // Clean up blob URLs to prevent memory leaks
    previewUrls.forEach(url => {
      if (url.startsWith('data:')) {
        // Data URLs don't need to be revoked
      } else if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });

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
    setEditingReview(null);
    setUploadingImages(false);
    setShowForm(false);

    // Очищуємо input файлів
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formatPrice = (price: number) => {
    return `${Math.round(price)} ₴`;
  };

  const formatWeight = (weight: number) => {
    return `${weight} кг`;
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
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Фото-відгуки</h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Управління відгуками з фотографіями тортів</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <svg
                className={`w-5 h-5 transition-transform ${showForm ? 'rotate-45' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>{showForm ? 'Приховати форму' : 'Додати відгук'}</span>
            </button>
          </div>
        </div>

        {/* Форма додавання/редагування */}
        {showForm && (
          <div id="review-form" className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-2 sm:space-y-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {editingReview ? 'Редагувати відгук' : 'Додати новий відгук'}
              </h2>
              {editingReview && (
                <button
                  onClick={resetForm}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 self-start sm:self-auto"
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

                {/* Existing Images (for edit mode) */}
                {editingReview && editingReview.images && editingReview.images.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Поточні зображення: (перетягніть для зміни порядку)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {editingReview.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative group cursor-move"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', index.toString());
                            e.dataTransfer.setData('source', 'existing');
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            const source = e.dataTransfer.getData('source');
                            if (source === 'existing' && fromIndex !== index) {
                              moveExistingImage(fromIndex, index);
                            }
                          }}
                        >
                          <div className="relative">
                            <Image
                              src={image}
                              alt={`Review ${index + 1}`}
                              width={120}
                              height={120}
                              className="object-cover rounded-lg border-2 border-gray-200 hover:border-pink-300 transition-colors"
                            />
                            {/* Position indicator */}
                            <div className="absolute top-1 left-1 bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            {/* Drag handle */}
                            <div className="absolute top-1 right-7 bg-gray-800 bg-opacity-70 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            </div>
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
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
                  disabled={submitting || uploadingImages}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />

                {uploadingImages && (
                  <div className="flex items-center space-x-2 mt-2 text-pink-600">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm">Завантаження зображень...</span>
                  </div>
                )}

                {/* New Images Preview */}
                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Попередній перегляд: (перетягніть для зміни порядку)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative group cursor-move"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', index.toString());
                            e.dataTransfer.setData('source', 'preview');
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            const source = e.dataTransfer.getData('source');
                            if (source === 'preview' && fromIndex !== index) {
                              movePreviewImage(fromIndex, index);
                            }
                          }}
                        >
                          <div className="relative">
                            <Image
                              src={url}
                              alt={`Preview ${index + 1}`}
                              width={120}
                              height={120}
                              className="object-cover rounded-lg border-2 border-gray-200 hover:border-pink-300 transition-colors"
                            />
                            {/* Position indicator */}
                            <div className="absolute top-1 left-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            {/* Drag handle */}
                            <div className="absolute top-1 right-7 bg-gray-800 bg-opacity-70 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                              </svg>
                            </div>
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => {
                                // Clean up the blob URL before removing
                                const urlToRemove = previewUrls[index];
                                if (urlToRemove && urlToRemove.startsWith('blob:')) {
                                  URL.revokeObjectURL(urlToRemove);
                                }

                                // Remove the file and preview URL at this index
                                setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                                setPreviewUrls(prev => prev.filter((_, i) => i !== index));
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>            <div className="flex items-center">
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
        )}

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
              reviews.map((review: PhotoReview) => (
                <div key={review._id?.toString()} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-3 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-1 sm:space-y-0">
                        <h3 className="text-lg font-semibold text-gray-900">{review.cakeName}</h3>
                        <span className="text-pink-600 font-bold text-sm sm:text-base">
                          {formatPrice(review.totalPrice)} / {formatWeight(review.totalWeight)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{review.cakeDescription}</p>
                      <div className="text-sm text-gray-500 space-y-1">
                        <div>Дата виконання: {new Date(review.completedDate).toLocaleDateString('uk-UA')}</div>
                        <div>Створено: {review.createdAt ? new Date(review.createdAt).toLocaleDateString('uk-UA') : 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Images Grid */}
                  {review.images.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Фотографії торту ({review.images.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {review.images.map((image: string, index: number) => (
                          <div
                            key={index}
                            className="relative group bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-pink-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                            onClick={() => window.open(image, '_blank')}
                          >
                            <div className="aspect-square">
                              <Image
                                src={image}
                                alt={`Торт ${index + 1}`}
                                width={120}
                                height={120}
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-2">
                                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                            </div>
                            <div className="absolute top-1 left-1 bg-pink-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors cursor-pointer"
                    >
                      Редагувати
                    </button>

                    <button
                      onClick={() => handleDelete(review._id?.toString() || '')}
                      className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors cursor-pointer"
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
