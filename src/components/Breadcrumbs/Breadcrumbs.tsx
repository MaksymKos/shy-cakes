import Link from 'next/link';

export default function Breadcrumbs({ path }: { path: string }) {
  return (
    <ol className="flex items-center text-sm">
      <li className="inline-flex items-center">
        <Link
          className="flex items-center text-white/90 hover:text-white transition-colors font-medium"
          href="/"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Головна
        </Link>
        <svg className="mx-2 w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </li>
      <li className="text-white font-medium" aria-current="page">
        {path}
      </li>
    </ol>
  )
}
