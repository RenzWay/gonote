import React, { useEffect, useState } from "react";
import Badge from "@mui/material/Badge";
import { Link } from "react-router-dom";
import {
  PlusSquare,
  ChartLine,
  SquareMenu,
  ArrowRight,
  Clock,
  CheckCircle,
  StarIcon,
  FileX,
} from "lucide-react";

import { getGonoteTask } from "../model/model";

const quickAction = [
  {
    to: "/add",
    title: "Add Task",
    icon: <PlusSquare />,
    bg: "bg-blue-400",
  },
  {
    to: "/all",
    title: "All Task",
    icon: <SquareMenu />,
    bg: "bg-purple-400",
  },
];

const boxActivities = [
  {
    key: "total",
    title: "Total Task",
    filter: (tasks) => tasks.length,
    percent: (tasks) => 100, // total = 100%
    icon: <ChartLine size={45} color="#009dff" />,
    bgColor: "bg-blue-100",
  },
  {
    key: "active",
    title: "Active Task",
    filter: (tasks) => tasks.filter((t) => !t.complete).length,
    percent: (tasks) =>
      tasks.length === 0
        ? 0
        : Math.round(
            (tasks.filter((t) => !t.complete).length / tasks.length) * 100
          ),
    icon: <Clock size={45} color="#f97316" />,
    bgColor: "bg-orange-100",
  },
  {
    key: "complete",
    title: "Complete Task",
    filter: (tasks) => tasks.filter((t) => t.complete).length,
    percent: (tasks) =>
      tasks.length === 0
        ? 0
        : Math.round(
            (tasks.filter((t) => t.complete).length / tasks.length) * 100
          ),
    icon: <CheckCircle size={45} color="#84cc16" />,
    bgColor: "bg-lime-100",
  },
  {
    key: "favorite",
    title: "Favorite Task",
    filter: (tasks) => tasks.filter((t) => t.favorite).length,
    percent: (tasks) =>
      tasks.length === 0
        ? 0
        : Math.round(
            (tasks.filter((t) => t.favorite).length / tasks.length) * 100
          ),
    icon: <StarIcon size={45} color="#facc15" />,
    bgColor: "bg-yellow-100",
  },
];

export default function HomePage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getGonoteTask().then(setData);
  }, []);

  const recentTasks = [...data]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <>
      <header className="px-20 py-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Track your activity and manage your task efficiently
        </p>
      </header>
      <section className="px-8 py-6 container-lg" role="main">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {boxActivities.map((item) => (
            <div
              className="p-6 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              key={item.key}
            >
              <header className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{item.title}</p>
                  <h5 className="text-2xl font-bold text-gray-800">
                    {item.filter(data)}
                  </h5>
                </div>
                <div className={`p-3 rounded-lg ${item.bgColor}`}>
                  {item.icon}
                </div>
              </header>

              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all duration-300"
                    style={{ width: `${item.percent(data)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {item.percent(data)}%
                </p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 gap-6 grid grid-cols-1 sm:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm">
            <header className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Quick Action
              </h3>
            </header>
            <div className="grid gap-3 my-auto p-4">
              {quickAction.map((item) => (
                <Link
                  key={item.title}
                  className={`${item.bg} flex items-center gap-3 px-4 py-3 rounded-lg text-white text-decoration-none
                    shadow-sm hover:shadow-md transition-all duration-200 hover:opacity-90`}
                  to={item.to}
                >
                  <div className="p-2 bg-white/20 rounded-lg">{item.icon}</div>
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <header className="px-6 py-4 border-b border-gray-100">
              <h3 className=" text-gray-400 text-lg font-semibold">
                Recent Task
              </h3>
            </header>

            <div className="px-6 py-8" id="taskList">
              {recentTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                  <div className="bg-gray-100 p-6 rounded-full shadow-inner mb-4">
                    <FileX className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-xl font-semibold">Tidak ada data</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Silakan tambah data terlebih dahulu
                  </p>
                  <a
                    href="/add"
                    className="mt-6 inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition no-underline"
                  >
                    Tambah Data
                  </a>
                </div>
              ) : (
                <ul className="flex flex-column gap-4 ">
                  {recentTasks.map((task) => (
                    <Link
                      to={"/all"}
                      key={task.id}
                      className="text-dark text-decoration-none"
                    >
                      <li className="flex flex-col list-unstyled border-l-4 p-3 border-l-amber-500 rounded-lg transition-all shadow-md hover:bg-gray-400">
                        <h5 className="font-semibold text-gray-800">
                          {task.title}
                        </h5>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {task.content}
                        </p>
                        <span className="text-xs text-gray-400 mt-1">
                          {new Date(task.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-center py-4 border-t border-gray-100">
              <Link
                className="flex items-center gap-2 text-decoration-none hover:opacity-80 transition-opacity"
                to="/all"
                style={{ color: "#9333ea" }}
              >
                <span className="font-medium">View All Tasks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* <footer className="p-10">
          <h1>inisial</h1>
        </footer> */}
      </section>
    </>
  );
}
