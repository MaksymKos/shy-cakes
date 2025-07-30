'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  general?: string;
}

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ім\'я обов\'язкове';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Ім\'я має бути не менше 2 символів';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email обов\'язковий';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Невірний формат email';
    }

    if (!formData.password) {
      newErrors.password = 'Пароль обов\'язковий';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Пароль має бути не менше 8 символів';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Пароль має містити принаймні одну велику літеру';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Пароль має містити принаймні одну малу літеру';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Пароль має містити принаймні одну цифру';
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^(\+38)?[\s\-]?(\(?0\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2})$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Невірний формат телефону';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          phone: formData.phone?.trim() || undefined,
          role: 'user'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || 'Помилка при реєстрації' });
        return;
      }

      setShowSuccess(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const result = await signIn('credentials', {
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setErrors({ general: `Реєстрація успішна, але вхід не вдався: ${result.error}` });
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
        } else if (result?.ok) {
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          setErrors({ general: 'Реєстрація успішна, але сталася невідома помилка при вході' });
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
        }
      } catch {
        setErrors({ general: 'Реєстрація успішна, але не вдалося автоматично увійти. Спробуйте увійти вручну.' });
        setTimeout(() => {
          router.push('/auth/signin');
        }, 2000);
      }

    } catch {
      setErrors({ general: 'Виникла помилка. Спробуйте ще раз.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-24 w-24 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={96}
              height={96}
              className="h-20 w-auto"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Створення акаунту
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Або{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-pink-600 hover:text-pink-500 transition-colors duration-200"
            >
              увійдіть в існуючий акаунт
            </Link>
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg px-8 py-8">
          {showSuccess && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    Реєстрація успішна! Входимо в акаунт...
                  </p>
                </div>
              </div>
            </div>
          )}

          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Повне ім&apos;я *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm transition-colors duration-200 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Введіть ваше повне ім&apos;я"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email адреса *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm transition-colors duration-200 ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="example@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Номер телефону
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm transition-colors duration-200 ${
                  errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="+380 XX XXX XX XX"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Пароль *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 focus:z-10 sm:text-sm transition-colors duration-200 ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Створіть надійний пароль"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <div className="mt-1 text-xs text-gray-500">
                Пароль має містити мінімум 8 символів, включаючи великі та малі літери, цифри
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Створюємо акаунт...
                  </div>
                ) : (
                  'Створити акаунт'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-xs text-gray-500">
              Створюючи акаунт, ви погоджуєтесь з нашими{' '}
              <Link href="/terms" className="text-pink-600 hover:text-pink-500">
                Умовами використання
              </Link>{' '}
              та{' '}
              <Link href="/privacy" className="text-pink-600 hover:text-pink-500">
                Політикою конфіденційності
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
