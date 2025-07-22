import React, { useEffect, useState } from "react";
import {
  Paper,
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
  CardHeader,
  CardMedia,
  Badge,
} from "@mui/material";

import {
  Plus,
  Edit,
  Star,
  Trash2,
  CheckCircle,
  Circle,
  FileX,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getGonoteTask,
  deleteTask,
  toggleFavorite,
  toggleComplete,
} from "../model/model";
import Loading from "../lib/loading";
import dayjs from "dayjs";

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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const dataTasks = [...data]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

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
          className="bg-blue-600 hover:bg-sky-400 hover:-translate-y-[5px] active:translate-y-0 transition-all duration-150 p-2 sm:p-3 rounded-1 text-light text-decoration-none flex gap-2 items-center justify-center sm:justify-start w-full sm:w-auto"
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
              <TextField label="🔍 Search" fullWidth type="search" />
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

        {/* CONTENT */}
        {loading ? (
          <Loading bolean={true} />
        ) : dataTasks.length === 0 ? (
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
          <CardView data={data} setData={setData} />
        )}
      </div>
    </section>
  );
}

function CardView({ data, setData }) {
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

  const handleToggleComplete = async (id, currentValue) => {
    await toggleComplete(id, currentValue);
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, complete: !item.complete } : item
      )
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
      {data.map((item) => (
        <Card
          key={item.id}
          className="shadow-md border border-gray-100 rounded-xl transition-all duration-500 hover:scale-[1.01]"
          sx={{ backgroundColor: "#fff", padding: "16px" }}
        >
          <CardContent className="space-y-2">
            <Typography variant="h6" className="font-bold text-gray-800">
              {item.title}
            </Typography>

            <Typography className="text-sm text-gray-600 mb-4">
              Category:{" "}
              <span className="font-medium bg-indigo-400 text-white p-1 rounded">
                {item.category}
              </span>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded ${
                  item.complete
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {item.complete ? "Complete" : "Active"}
              </span>
            </Typography>
            <hr />
            <Typography className="text-sm text-gray-700">
              {item.content}
            </Typography>
            <div className="flex justify-between text-sm text-gray-500 pt-2">
              <span>
                {item.date?.toDate?.().toLocaleDateString?.() || "Unknown"}
              </span>
              <span
                className={`font-semibold badge ${getPriorityStyle(
                  item.priority
                )}`}
              >
                {item.priority}
              </span>
            </div>
          </CardContent>

          <hr className="my-2" />

          <CardActions className="flex justify-end gap-2">
            <Button
              color="warning"
              onClick={() => handleFavorite(item.id, item.favorite)}
            >
              <Star
                size={18}
                fill={item.favorite ? "#facc15" : "none"}
                color={item.favorite ? "#facc15" : "#9ca3af"}
              />
            </Button>

            <Button
              color="success"
              className="text-blue-500"
              component={Link}
              to={`/edit/${item.id}`}
            >
              <Edit size={18} />
            </Button>

            <Button
              color="error"
              className="text-red-500"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 size={18} />
            </Button>

            <Button
              onClick={() => handleToggleComplete(item.id, item.complete)}
              color={item.complete ? "success" : "secondary"}
              aria-label="toggle-complete"
            >
              {item.complete ? (
                <CheckCircle size={18} className="text-green-600" />
              ) : (
                <Circle size={18} className="text-gray-500" />
              )}
            </Button>
          </CardActions>
        </Card>
      ))}
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
