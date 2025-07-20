import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import AddTaskPage from "./pages/addTask.jsx";
import HomePage from "./pages/homepage.jsx";
import Sidebar from "./lib/navbar.jsx";
import AllTask from "./pages/allTask.jsx";

const rute = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/add",
    element: <AddTaskPage />,
  },
  {
    path: "/all",
    element: <AllTask />,
  },
];

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <BrowserRouter>
      <section role="none" className="flex h-screen">
        <header>
          <Sidebar open={open} setOpen={setOpen} />
        </header>
        <main className="flex-1 overflow-auto transition-all duration-300">
          <Routes>
            {rute.map((item) => (
              <Route key={item.path} path={item.path} element={item.element} />
            ))}
          </Routes>
        </main>
      </section>
    </BrowserRouter>
  );
}
