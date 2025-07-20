import React from "react";
import Badge from "@mui/material/Badge";
import { ChartLine } from "lucide-react";
import { Clock } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { FileIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { PlusSquare, ChartColumn, SquareMenu, ArrowRight } from "lucide-react";

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
    title: "Total Task",
    length: 0,
    logo: <ChartLine size={45} color="#009dff" />,
    date: "prom last year",
    bgColor: "bg-blue-100",
  },
  { 
    title: "Active Task",
    length: 0,
    logo: <Clock size={45} color="#f97316" />,
    date: "prom last year",
    bgColor: "bg-orange-100",
  },
  {
    title: "Complete Task",
    length: 0,
    logo: <CheckCircle size={45} color="#84cc16" />,
    date: "prom last year",
    bgColor: "bg-lime-100",
  },
  {
    title: "Another Task",
    length: 0,
    logo: <FileIcon size={45} color="#9333ea" />,
    date: "prom last year",
    bgColor: "bg-purple-100",
  },
];

export default function HomePage() {
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
              key={item.title}
            >
              <header className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">{item.title}</p>
                  <h5 className="text-2xl font-bold text-gray-800">
                    {item.length}
                  </h5>
                </div>
                <div className={`p-3 rounded-lg ${item.bgColor}`}>
                  {item.logo}
                </div>
              </header>

              <div className="pt-2 border-t border-gray-100">
                <h6 className="text-sm text-gray-500">{item.date}</h6>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 gap-6 grid grid-cols-1 sm:grid-cols-2">
          <div className="bg-white rounded-xl shadow-sm">
            <header className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">
                Recent Task
              </h3>
            </header>
            <div className="px-6 py-8" id="taskList">
              <div className="text-center text-gray-500">No recent tasks</div>
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
        </section>

        {/* <footer className="p-10">
          <h1>inisial</h1>
        </footer> */}
      </section>
    </>
  );
}
