import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import AddTaskPage from './pages/addTask.jsx';
import HomePage from './pages/homepage.jsx';
import Sidebar from './lib/navbar.jsx';
import AllTask from './pages/allTask.jsx';
import EditTaskPage from './pages/EditTask.jsx';

const rute = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/add',
    element: <AddTaskPage />,
  },
  {
    path: '/all',
    element: <AllTask />,
  },
  {
    path: '/edit/:id',
    element: <EditTaskPage />,
  },
];

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      <section role="body" className="flex h-screen">
        <header>
          <Sidebar open={open} setOpen={setOpen} />
        </header>
        <main className="flex-1 overflow-auto transition-all duration-300">
          <Routes>
            {rute.map((item) => (
              <Route key={item.path} path={item.path} element={item.element} />
            ))}
          </Routes>
          <Footer />
        </main>
      </section>
    </BrowserRouter>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t mt-10 py-6 px-4 sm:px-8 text-sm text-gray-600">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} <strong>GoNote</strong>. All rights reserved.
        </p>
        <div className="flex gap-4 text-blue-500">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="mailto:support@gonote.com" className="hover:underline">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
