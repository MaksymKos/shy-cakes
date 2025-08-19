import React from 'react'
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex items-center space-x-4">

        <button onClick={() => router.push('/admin')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Назад до панелі</span>
        </button>

        <div className="h-6 w-px bg-gray-300"></div>

        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

      </div>
    </div>
  );
};

export default AdminHeader;