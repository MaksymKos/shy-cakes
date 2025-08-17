import React from 'react'

interface CatalogActionsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategories: { value: string; label: string }[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CatalogActions = ({ searchTerm, setSearchTerm, filterCategories, selectedCategory, setSelectedCategory }: CatalogActionsProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
      <div className="w-full lg:w-1/3">
        <div className="relative">
          <input
            type="text"
            placeholder="Пошук товарів..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#90e0ef]/30 focus:border-[#90e0ef] transition-all duration-200 bg-white/80 backdrop-blur-sm shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="pr-2 flex items-center"
              >
                <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button className="pr-3 flex items-center">
              <svg className="h-5 w-5 text-gray-400 hover:text-[#90e0ef] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-2/3">
        <div className="flex flex-wrap gap-3">
          {filterCategories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value === selectedCategory ? '' : category.value)}
              className={`px-4 py-2 rounded-xl border-2 transition-all duration-200 font-medium shadow-sm ${selectedCategory === category.value
                ? 'bg-[#90e0ef] text-gray-900 border-[#90e0ef] shadow-md scale-105'
                : 'bg-white/80 text-gray-700 border-gray-200 hover:border-[#90e0ef] hover:text-[#023e8a] hover:bg-[#90e0ef]/10 backdrop-blur-sm'
                }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CatalogActions