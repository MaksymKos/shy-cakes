import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold text-gray-800">404 - Сторінка не знайдена</h1>
      <p className="mt-4 text-gray-600">Сторінку не знайдено або вона була видалена.</p>
      <Link href="/" className="border p-4 mt-6 text-blue-500">Повернутись на головну</Link>
    </div>
  );
}