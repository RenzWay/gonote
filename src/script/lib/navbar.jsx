import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X, Menu, LayoutDashboard, PlusCircle, SquareMenu } from "lucide-react";

const links = [
  { to: "/", name: "Dashboard", icon: LayoutDashboard },
  { to: "/add", name: "Add Task", icon: PlusCircle },
  { to: "/all", name: "All Task", icon: SquareMenu },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Overlay untuk menutup sidebar saat klik di luar */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Button buka menu selalu tampil saat sidebar tertutup */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed top-4 left-4 z-50 p-2 bg-white shadow rounded ${
          open ? "hidden" : "block"
        }`}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 bg-white border-r shadow-md transition-all duration-300 overflow-hidden ${
          open ? "w-64" : "w-0"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h1 className="text-xl font-bold">GoNote</h1>
          <button
            onClick={() => setOpen(false)}
            className="hover:bg-gray-100 p-1 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-1 px-4 py-6">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="flex items-center px-4 py-2.5 text-dark text-decoration-none font-medium rounded-lg
                transition-all duration-200 ease-in-out
                hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm
                active:bg-gray-200 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <link.icon className="w-5 h-5 mr-3 stroke-current" />
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
