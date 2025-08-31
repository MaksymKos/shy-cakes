"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // TODO: Replace with real API call
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Введіть коректний email");
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-[#90e0ef] via-white to-[#90e0ef] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Відновлення паролю
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Введіть email, на який зареєстровано акаунт
          </p>
        </div>
        <div className="bg-white shadow-xl rounded-lg px-8 py-8 border border-[#90e0ef]">
          {sent ? (
            <div className="text-center text-[#0077b6] font-medium">
              Якщо email існує — інструкції надіслано!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#90e0ef] focus:border-[#90e0ef] focus:z-10 sm:text-sm transition-colors duration-200 ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                  placeholder="example@email.com"
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-[#90e0ef] text-sm font-medium rounded-md text-white bg-[#0077b6] hover:bg-[#023e8a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#90e0ef] transition-all duration-200"
              >
                Надіслати інструкції
              </button>
            </form>
          )}
          <div className="mt-6 text-center">
            <Link href="/auth/signin" className="text-sm text-[#90e0ef] hover:text-[#00b4d8] transition-colors duration-200">
              Повернутись до входу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
