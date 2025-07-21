import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
} from "@mui/material";
import { Plus, Edit, Star, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getGonoteTask, deleteTask, toggleFavorite } from "../model/model";
import Loading from "../lib/loading";

// UTILITY
const getPriorityStyle = (priority) => {
  switch (priority) {
    case "Low":
      return "bg-green-400 text-green-800";
    case "Medium":
      return "bg-yellow-400 text-yellow-800";
    case "High":
      return "bg-orange-400 text-orange-800";
    case "Urgent":
      return "bg-red-400 text-red-800";
    default:
      return "bg-gray-400 text-gray-800";
  }
};

// MAIN COMPONENT
export default function AllTask() {
  const [allStatus, setAllStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasks = await getGonoteTask();
        setData(tasks);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="container-lg mt-4 sm:mt-10 px-4 sm:px-6">
      <header className="flex flex-col mx-10 sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">All Task</h1>
          <h6 className="text-gray-600 text-sm sm:text-base">
            Manage and organize your task list
          </h6>
        </div>
        <Link
          to="/add"
          className="bg-blue-400 p-2 sm:p-3 rounded-1 text-light text-decoration-none flex gap-2 items-center justify-center sm:justify-start w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Task
        </Link>
      </header>

      <div className="w-full mt-6 sm:mt-10 flex flex-col gap-4">
        {/* FILTER & SEARCH */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="w-full sm:flex-grow">
              <TextField
                label="🔍 Search"
                fullWidth
                type="search"
                size="small"
              />
            </div>

            <div className="w-full sm:basis-1/4">
              <ControlSearch
                title="Status Filter"
                ArrayData={["Active", "Complete"]}
                data={allStatus}
                setData={(e) => setAllStatus(e.target.value)}
              />
            </div>

            <div className="w-full sm:basis-1/4">
              <ControlSearch
                title="Sort By"
                ArrayData={["Sort by date", "Sort by priority", "Sort by name"]}
                data={sortBy}
                setData={(e) => setSortBy(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* VIEW MODE SWITCH */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setViewMode("table")}
            className={`btn ${
              viewMode === "table" ? "btn-primary" : "btn-light"
            }`}
          >
            Table
          </button>
          <button
            onClick={() => setViewMode("card")}
            className={`btn ${
              viewMode === "card" ? "btn-primary" : "btn-light"
            }`}
          >
            Cards
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <Loading bolean={true} />
        ) : viewMode === "table" ? (
          <TableTask data={data} setData={setData} />
        ) : (
          <p>Card view dimatikan</p> // atau kamu bisa buat komponen CardView jika mau
        )}
      </div>
    </section>
  );
}

// TABEL TASK
function TableTask({ data, setData }) {
  const handleDelete = async (id) => {
    await deleteTask(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFavorite = async (id, currentValue) => {
    await toggleFavorite(id, currentValue);
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const headTable = ["No", "Title", "Category", "Date", "Priority", "Actions"];

  return (
    <div className="overflow-auto -mx-4 sm:mx-0">
      <TableContainer
        component={Paper}
        className="shadow-sm mt-6 min-w-[800px] sm:min-w-0"
      >
        <Table>
          <TableHead>
            <TableRow className="bg-light">
              {headTable.map((row) => (
                <TableCell
                  key={row}
                  className="font-semibold"
                  sx={{
                    minWidth: row === "Title" ? 250 : "auto",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow
                key={row.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{row.title}</div>
                  <div className="text-sm text-muted line-clamp-2 max-w-xs">
                    {row.content}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="badge bg-primary">{row.category}</span>
                </TableCell>
                <TableCell>
                  {row.date?.toDate?.().toLocaleDateString?.() || "Unknown"}
                </TableCell>
                <TableCell>
                  <span className={`badge ${getPriorityStyle(row.priority)}`}>
                    {row.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="d-flex gap-1 sm:gap-2 flex-nowrap">
                    <button
                      onClick={() => handleFavorite(row.id, row.favorite)}
                      className="btn btn-light btn-sm rounded-circle p-1"
                    >
                      <Star
                        size={16}
                        color={row.favorite ? "#facc15" : "#9ca3af"}
                        fill={row.favorite ? "#facc15" : "none"}
                      />
                    </button>
                    <button className="btn btn-light btn-sm rounded-circle p-1">
                      <Edit size={16} className="text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="btn btn-light btn-sm rounded-circle p-1"
                    >
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

// CONTROL SELECT
function ControlSearch({ title, ArrayData, setData, data, className = "" }) {
  return (
    <FormControl fullWidth className={className}>
      <InputLabel id={`${title}-label`}>{title}</InputLabel>
      <Select
        labelId={`${title}-label`}
        value={data}
        label={title}
        onChange={setData}
      >
        {ArrayData.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
