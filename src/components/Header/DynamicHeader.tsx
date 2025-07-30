'use client';

import dynamic from 'next/dynamic';

const DynamicHeader = dynamic(() => import('./header'), {
  ssr: false,
  loading: () => (
    <header className="bg-white border-b border-gray-300 fixed top-0 left-0 z-10 w-full">
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 lg:px-8">
        <div className="flex lg:flex-1">
          <div className="animate-pulse h-12 w-24 bg-gray-200 rounded"></div>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-4 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <div className="animate-pulse h-8 w-20 bg-gray-200 rounded"></div>
        </div>
      </nav>
    </header>
  )
});

export default DynamicHeader;
