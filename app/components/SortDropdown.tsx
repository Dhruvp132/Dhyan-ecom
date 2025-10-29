"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  options: SortOption[];
  defaultValue?: string;
  onSort?: (value: string) => void;
}

export function SortDropdown({ options, defaultValue = options[0]?.value, onSort }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  const selectedLabel = options.find((opt) => opt.value === selected)?.label || "Featured";

  const handleSelect = (value: string) => {
    setSelected(value);
    setIsOpen(false);
    onSort?.(value);
  };

  return (
    <div className="relative w-fit">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-900 rounded-md text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 transition-colors duration-200"
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-900 rounded-md shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors duration-150 ${
                selected === option.value ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
