import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarFoldIcon, LayoutDashboard, Menu, PlusCircle, SquareMenu, X } from 'lucide-react';

const links = [
  { to: '/', name: 'Dashboard', icon: LayoutDashboard },
  { to: '/add', name: 'Add Task', icon: PlusCircle },
  { to: '/all', name: 'All Tasks', icon: SquareMenu },
  { to: '/schedule', name: 'Schedule', icon: CalendarFoldIcon },
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Backdrop dengan animasi - FIXED */}
      <div
        className={`fixed inset-0 z-30 transition-all duration-300 ${
          open ? 'bg-opacity-20 backdrop-blur-sm' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed top-4 left-4 z-50 p-2 bg-white shadow-lg rounded transition-all duration-300 hover:shadow-xl hover:scale-105 ${
          open ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        <Menu size={24} className="text-gray-700" />
      </button>

      {/* Sidebar Modern */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-white border-r shadow-xl transition-all duration-500 ease-in-out overflow-hidden ${
          open ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
        }`}
      >
        {/* Header Sidebar - FIXED ICON */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
              {/* Icon GoNote tetap seperti semula */}
              <img
                src="/public/notes.png"
                width={24}
                height={24}
                alt="GoNote icon"
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-800">GoNote</h1>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center "
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-2 p-4 mt-2">
          {links.map((link, index) => {
            const isActive = location.pathname === link.to;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`flex items-center px-4 py-3 text-decoration-none rounded-xl
                  transition-all duration-300 ease-out transform
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md hover:scale-102'
                  }
                  active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50
                  group`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'slideInLeft 0.5s ease-out both',
                }}
              >
                <div
                  className={`relative flex items-center justify-center mr-3 transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition-all duration-300 ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                </div>
                <span
                  className={`font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : 'group-hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-gray-50">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">GoNote v5.10.0</p>
            <p className="text-xs text-gray-400">Your Modern Note Taking App</p>
          </div>
        </div>
      </aside>
    </>
  );
}
