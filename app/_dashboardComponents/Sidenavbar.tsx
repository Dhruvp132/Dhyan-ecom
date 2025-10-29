"use client";
import {
  DatabaseIcon,
  HomeIcon,
  ShoppingCart,
  User2Icon,
  MenuIcon,
  XIcon,
  Package,
} from "lucide-react";
import { Link } from "next-view-transitions";
import React, { FC, useState } from "react";

const Sidenavbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<Boolean>(false);

  return (
    <header className="bg-purple-50 shadow sticky top-0 z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Dashboard Link */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-teal-600"
            >
              <DatabaseIcon className="h-6 w-6 text-teal-600" />
              <span className="hidden md:block">Dashboard</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block" aria-label="Global">
            <ul className="flex items-center gap-6 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-900 hover:text-teal-600 flex justify-center items-end gap-1"
                >
                  <HomeIcon className="h-6 w-6" />
                  <span className="ml-1">Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/users"
                  className="text-gray-900 hover:text-teal-600 flex justify-center items-end gap-1"
                >
                  <User2Icon className="h-6 w-6" />
                  <span className="ml-1">Users</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/products"
                  className="text-gray-900 hover:text-teal-600 flex justify-center items-end gap-1"
                >
                  <Package className="h-6 w-6" />
                  <span className="ml-1">Products</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/orders"
                  className="text-gray-900 hover:text-teal-600 flex justify-center items-end gap-1"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span className="ml-1">Orders</span>
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/dashboard/users"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Users
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/dashboard/products"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Products
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              href="/dashboard/orders"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Orders
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Sidenavbar;
