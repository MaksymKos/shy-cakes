import React from 'react';

export default function Loader({ text = "Завантаження..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
      <div className="relative flex items-center justify-center mb-6">
        <span className="sr-only">{text}</span>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#90e0ef] border-opacity-70"></div>
        <div className="absolute flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-[#90e0ef] to-[#48cae4] opacity-80 blur-sm"></div>
        <div className="absolute text-3xl select-none">🍰</div>
      </div>
      <div className="text-lg font-semibold text-[#48cae4] animate-pulse">{text}</div>
    </div>
  );
}