import { ProductItemType } from '@/types/productItem';
import Image from 'next/image'
import React, { useState } from 'react'

interface CatalogItemInformationProps {
  product: ProductItemType;
  selectedImageIndex: number;
  setSelectedImageIndex: (index: number) => void;
  likedProducts: Set<string>;
  toggleLike: (productId: string) => void;
  quantity: number;
  handleQuantityChange: (newQuantity: number) => void;
  handleOrderProduct: () => void;
}

const CatalogItemInformation = ({ product, selectedImageIndex, setSelectedImageIndex, likedProducts, toggleLike, quantity, handleQuantityChange, handleOrderProduct }: CatalogItemInformationProps) => {
  const [shareButtonText, setShareButtonText] = useState('📤 Поділитися');
  
  
  const formatPrice = (price: number, unit: 'kg' | 'piece' = 'kg') => {
    const unitText = unit === 'kg' ? '/ кг' : '/ шт';
    return `${Math.round(price)} ₴ ${unitText}`;
  };

    const handleShareProduct = async () => {
      const url = window.location.href;
  
      try {
        await navigator.clipboard.writeText(url);
        setShareButtonText('✅ Скопійовано!');
  
        // Reset button text after 2 seconds
        setTimeout(() => {
          setShareButtonText('📤 Поділитися');
        }, 2000);
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setShareButtonText('✅ Скопійовано!');
          setTimeout(() => {
            setShareButtonText('📤 Поділитися');
          }, 2000);
        } catch {
          setShareButtonText('❌ Помилка');
          setTimeout(() => {
            setShareButtonText('📤 Поділитися');
          }, 2000);
        }
        document.body.removeChild(textArea);
      }
    };
  
  return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Галерея зображень */}
          <div className="space-y-4">
            {/* Головне зображення */}
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📸</div>
                    <p className="text-gray-500">Немає фото</p>
                  </div>
                </div>
              )}

              {/* Like button on main image */}
              <button
                onClick={() => toggleLike(product._id)}
                className="absolute top-4 right-4 p-3 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {likedProducts.has(product._id) ? (
                  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Мініатюри */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${selectedImageIndex === index
                      ? 'border-pink-500'
                      : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Інформація про товар */}
          <div className="space-y-6">
            {/* Категорія */}
            <div>
              <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {/* Назва */}
            <h1 className="text-3xl font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Ціна */}
            <div className="text-4xl font-bold text-pink-600">
              {formatPrice(product.price, product.unit)}
            </div>

            {/* Опис */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Опис</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Кількість і кнопки дій */}
            <div className="space-y-4">
              {/* Селектор кількості */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {product.unit === 'kg' ? 'Вага (кг)' : 'Кількість (шт)'}
                </label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(quantity - (product.unit === 'kg' ? 0.5 : 1))}
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:border-pink-500 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  <div className="text-center min-w-[100px]">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0)}
                      min={product.unit === 'kg' ? 0.5 : 1}
                      max={product.unit === 'kg' ? 20 : 100}
                      step={product.unit === 'kg' ? 0.5 : 1}
                      className="w-20 text-center border border-gray-300 rounded px-3 py-2 text-lg font-semibold"
                    />
                  </div>

                  <button
                    onClick={() => handleQuantityChange(quantity + (product.unit === 'kg' ? 0.5 : 1))}
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 hover:border-pink-500 flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Загальна сума: <span className="font-semibold text-pink-600">{Math.round(product.price * quantity)} ₴</span>
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleOrderProduct}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 px-6 rounded-lg text-lg font-semibold transition-colors cursor-pointer"
                >
                  🛒 Замовити зараз
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => toggleLike(product._id)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer ${likedProducts.has(product._id)
                    ? 'bg-red-50 border border-red-500 text-red-600'
                    : 'border border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-600'
                    }`}
                >
                  {likedProducts.has(product._id) ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      В улюблених
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      У бажання
                    </>
                  )}
                </button>
                <button
                  onClick={handleShareProduct}
                  className="border border-gray-300 hover:border-pink-500 text-gray-700 hover:text-pink-600 py-3 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  {shareButtonText}
                </button>
              </div>
            </div>

            {/* Додаткова інформація */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Додаткова інформація</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Категорія:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Наявність:</span>
                  <span className="font-medium text-blue-600">Виготовляємо під замовлення</span>
                </div>
                <div className="flex justify-between">
                  <span>Одиниця виміру:</span>
                  <span className="font-medium">{product.unit === 'kg' ? 'кг' : 'шт'}</span>
                </div>
              </div>
            </div>

            {/* Інформація про упаковку та зберігання - показуємо тільки якщо є хоча б одне поле */}
            {
              <div className="border-t pt-6">
                <div className="space-y-6">
                  {product.packaging && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Упаковка</h3>
                      <p className="text-gray-600">
                        {product.packaging}
                      </p>
                    </div>
                  )}

                  {product.importantInfo && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Важливо знати</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {product.importantInfo}
                      </p>
                    </div>
                  )}

                  {product.storageConditions && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Умови зберігання</h3>
                      <p className="text-gray-600 mb-3">
                        {product.storageConditions}
                      </p>
                    </div>
                  )}

                  {product.recommendations && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm text-yellow-800">
                        <span className="font-semibold">Порада:</span> {product.recommendations}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            }
          </div>
        </div>
  )
}

export default CatalogItemInformation;