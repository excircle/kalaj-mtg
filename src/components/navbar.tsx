import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand + Desktop Links */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-semibold text-gray-800">
              Kalaj MTG Catalog
            </Link>
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              <Link
                href="/register"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Register Cards
              </Link>
            </div>
          </div>

          {/* Right: Desktop Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHe0Fgy0Qn0EMNnqOjn1sLv0s7GChxSkfawg&s"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Click For Sexy Woman
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/menu1"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              Menu 1
            </Link>
            <Link
              href="/menu2"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              Menu 2
            </Link>
            <Link
              href="/menu3"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              Menu 3
            </Link>
            <Link
              href="/signin"
              className="block mt-2 px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="block mt-1 px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
