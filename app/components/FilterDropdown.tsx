"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronRight, X } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-mobile"

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterCategory {
  id: string
  label: string
  options: FilterOption[]
}

interface SortOption {
  label: string
  value: string
}

interface FilterDropdownProps {
  categories: FilterCategory[]
  sortOptions?: SortOption[]
  onApply?: (filters: Record<string, string[]>) => void
  onSort?: (value: string) => void
}

export function FilterDropdown({ categories, sortOptions, onApply, onSort }: FilterDropdownProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const [selectedSort, setSelectedSort] = useState(sortOptions?.[0]?.value || "featured")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileActiveCategory, setMobileActiveCategory] = useState<string | null>(null)
  const [isAnimatingIn, setIsAnimatingIn] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 1024px)") // Changed to lg breakpoint

  useEffect(() => {
    if (mobileMenuOpen) {
      setIsAnimatingIn(true)
    }
  }, [mobileMenuOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFilterChange = (categoryId: string, optionId: string) => {
    setSelectedFilters((prev) => {
      const current = prev[categoryId] || []
      const updated = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId]
      return { ...prev, [categoryId]: updated }
    })
  }

  const handleSortChange = (value: string) => {
    setSelectedSort(value)
    onSort?.(value)
  }

  const handleApply = () => {
    onApply?.(selectedFilters)
    handleCloseMenu()
  }

  const handleRemoveAll = () => {
    setSelectedFilters({})
    setMobileActiveCategory(null)
  }

  const handleNavigateBack = () => {
    setMobileActiveCategory(null)
  }

  const handleOpenCategory = (categoryId: string) => {
    setMobileActiveCategory(categoryId)
  }

  const handleCloseMenu = () => {
    setIsAnimatingOut(true)
    setTimeout(() => {
      setMobileMenuOpen(false)
      setMobileActiveCategory(null)
      setIsAnimatingOut(false)
      setIsAnimatingIn(false)
    }, 300)
  }

  const getCategory = (id: string) => categories?.find((cat) => cat.id === id)
  const getTotalSelected = () => Object.values(selectedFilters).flat().length

  // Safety check for categories
  if (!categories || categories.length === 0) {
    return null
  }

  // Mobile Menu (for sm and md screens)
  if (isMobile) {
    return (
      <>
        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200 lg:hidden"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="text-sm font-medium">Filter and sort</span>
        </button>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out ${
                isAnimatingOut ? "opacity-0" : isAnimatingIn ? "opacity-100" : "opacity-0"
              }`}
              onClick={handleCloseMenu}
            />

            <div
              className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 ease-out ${
                isAnimatingOut
                  ? "translate-y-full opacity-0"
                  : isAnimatingIn
                    ? "translate-y-0 opacity-100"
                    : "translate-y-full opacity-0"
              }`}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                {mobileActiveCategory ? (
                  <>
                    <button
                      onClick={handleNavigateBack}
                      className="flex items-center gap-2 text-gray-900 hover:text-gray-600 active:scale-95 transition-all duration-300"
                    >
                      <ChevronRight className="w-5 h-5 rotate-180" />
                      <span className="text-lg font-medium">{getCategory(mobileActiveCategory)?.label}</span>
                    </button>
                    <button
                      onClick={handleCloseMenu}
                      className="text-gray-400 hover:text-gray-600 active:scale-95 transition-all duration-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Filter and sort</h2>
                      <p className="text-sm text-gray-500">38 products</p>
                    </div>
                    <button
                      onClick={handleCloseMenu}
                      className="text-gray-400 hover:text-gray-600 active:scale-95 transition-all duration-200"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {mobileActiveCategory ? (
                  <div
                    className={`space-y-4 transition-all duration-300 ease-out ${
                      mobileActiveCategory ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
                    }`}
                  >
                    {getCategory(mobileActiveCategory)?.options.map((option, index) => (
                      <label
                        key={option.id}
                        className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-all duration-200 animate-in fade-in slide-in-from-right-4"
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[mobileActiveCategory]?.includes(option.id) || false}
                          onChange={() => handleFilterChange(mobileActiveCategory, option.id)}
                          className="w-5 h-5 border border-gray-300 rounded cursor-pointer accent-gray-900 transition-all duration-200"
                        />
                        <span className="text-base text-gray-700">
                          {option.label}
                          {option.count !== undefined && ` (${option.count})`}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Sort By Option - Only in mobile menu */}
                    {sortOptions && sortOptions.length > 0 && (
                      <div
                        className="border-b border-gray-200 pb-3 mb-3 animate-in fade-in slide-in-from-left-4"
                        style={{
                          animationDelay: "0ms",
                          animationFillMode: "both",
                        }}
                      >
                        <h3 className="text-sm font-medium text-gray-900 mb-3 px-2">Sort by</h3>
                        <div className="space-y-2">
                          {sortOptions.map((option, index) => (
                            <button
                              key={option.value}
                              onClick={() => handleSortChange(option.value)}
                              className={`w-full flex items-center justify-between py-2.5 px-2 rounded transition-all duration-200 ${
                                selectedSort === option.value
                                  ? "bg-gray-100 text-gray-900 font-medium"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                              style={{
                                animationDelay: `${(index + 1) * 50}ms`,
                              }}
                            >
                              <span className="text-base">{option.label}</span>
                              {selectedSort === option.value && (
                                <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Filter Categories */}
                    {categories.map((category, index) => (
                      <button
                        key={category.id}
                        onClick={() => handleOpenCategory(category.id)}
                        className="w-full flex items-center justify-between py-3 text-gray-900 hover:bg-gray-50 px-2 rounded active:scale-95 transition-all duration-200 animate-in fade-in slide-in-from-left-4"
                        style={{
                          animationDelay: `${(index + (sortOptions?.length || 0) + 1) * 50}ms`,
                          animationFillMode: "both",
                        }}
                      >
                        <span className="text-base font-medium">{category.label}</span>
                        <ChevronRight className="w-5 h-5 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button
                  onClick={handleRemoveAll}
                  className="flex-1 py-3 text-gray-900 font-medium hover:bg-gray-50 rounded active:scale-95 transition-all duration-200 border border-gray-200"
                >
                  Remove all
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 rounded active:scale-95 transition-all duration-200"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Desktop/Tablet Dropdowns (lg screens only)
  const leftCategories = categories.filter((cat) => ["size", "availability"].includes(cat.id.toLowerCase()))
  const rightCategories = categories.filter((cat) => ["feature", "price"].includes(cat.id.toLowerCase()))

  return (
    <div className="hidden lg:flex items-center justify-between gap-6" ref={dropdownRef}>
      {/* Left side filters */}
      <div className="flex items-center gap-3">
        {leftCategories.map((category) => (
          <div key={category.id} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === category.id ? null : category.id)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200"
            >
              <span className="text-sm font-medium">{category.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openDropdown === category.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === category.id && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50 rounded animate-in fade-in zoom-in-95 duration-200 origin-top">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <span className="text-sm text-gray-700">{selectedFilters[category.id]?.length || 0} selected</span>
                  <button
                    onClick={() => {
                      setSelectedFilters((prev) => ({
                        ...prev,
                        [category.id]: [],
                      }))
                    }}
                    className="text-sm font-medium text-gray-900 hover:underline active:scale-95 transition-all duration-200"
                  >
                    Reset
                  </button>
                </div>

                {/* Options */}
                <div className="px-6 py-4 space-y-3 max-h-96 overflow-y-auto">
                  {category.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters[category.id]?.includes(option.id) || false}
                        onChange={() => handleFilterChange(category.id, option.id)}
                        className="w-5 h-5 border border-gray-300 rounded cursor-pointer accent-gray-900 transition-all duration-200"
                      />
                      <span className="text-sm text-gray-700">
                        {option.label}
                        {option.count !== undefined && ` (${option.count})`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side filters */}
      <div className="flex items-center gap-3">
        {rightCategories.map((category) => (
          <div key={category.id} className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === category.id ? null : category.id)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-50 active:scale-95 transition-all duration-200"
            >
              <span className="text-sm font-medium">{category.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  openDropdown === category.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdown === category.id && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50 rounded animate-in fade-in zoom-in-95 duration-200 origin-top">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <span className="text-sm text-gray-700">{selectedFilters[category.id]?.length || 0} selected</span>
                  <button
                    onClick={() => {
                      setSelectedFilters((prev) => ({
                        ...prev,
                        [category.id]: [],
                      }))
                    }}
                    className="text-sm font-medium text-gray-900 hover:underline active:scale-95 transition-all duration-200"
                  >
                    Reset
                  </button>
                </div>

                {/* Options */}
                <div className="px-6 py-4 space-y-3 max-h-96 overflow-y-auto">
                  {category.options.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity duration-200"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters[category.id]?.includes(option.id) || false}
                        onChange={() => handleFilterChange(category.id, option.id)}
                        className="w-5 h-5 border border-gray-300 rounded cursor-pointer accent-gray-900 transition-all duration-200"
                      />
                      <span className="text-sm text-gray-700">
                        {option.label}
                        {option.count !== undefined && ` (${option.count})`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
