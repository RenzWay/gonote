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
} from "@mui/material";
import {
  Plus,
  Edit,
  Star,
  Trash2,
  CheckCircle,
  Circle,
  FileX,
  ClipboardListIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  getGonoteTask,
  deleteTask,
  toggleFavorite,
  toggleComplete,
} from "../model/model";
import Loading from "../lib/loading";

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "Low":
      return "bg-green-500 text-white";
    case "Medium":
      return "bg-yellow-500 text-white";
    case "High":
      return "bg-orange-500 text-white";
    case "Urgent":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-300 text-gray-800";
  }
};

export default function AllTask() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allStatus, setAllStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const filteredData = data
    .filter((item) => {
      if (allStatus === "Complete") return item.complete === true;
      if (allStatus === "Active") return item.complete === false;
      return true;
    })
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "Sort by priority": {
        const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case "Sort by name":
        return a.title.localeCompare(b.title);
      case "Sort by date":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  const dataTasks = sortedData;

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
    <section className="container-lg mt-8 px-4">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="flex gap-1 text-3xl font-bold text-slate-800">
            <img src="/public/check-list.png" width={50} alt="icon all task" />
            All Tugas
          </h1>
          <p className="text-sm text-slate-500">
            Manage and organize all your tasks here
          </p>
        </div>
        <Link
          to="/add"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all flex gap-2 items-center mt-4 sm:mt-0"
        >
          <Plus size={20} /> Tambah Tugas
        </Link>
      </header>

      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <TextField
            label="🔍 Cari Tugas"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <ControlSearch
            title="Filter Status"
            ArrayData={["None", "Active", "Complete"]}
            data={allStatus}
            setData={(e) => setAllStatus(e.target.value)}
          />
          <ControlSearch
            title="Sort By"
            ArrayData={[
              "None",
              "Sort by date",
              "Sort by priority",
              "Sort by name",
            ]}
            data={sortBy}
            setData={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Loading bolean={true} />
      ) : dataTasks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FileX className="mx-auto mb-4 w-12 h-12" />
          <p className="text-lg font-semibold">Belum ada tugas</p>
          <p className="text-sm">Silakan tambahkan tugas terlebih dahulu</p>
          <Link
            to="/add"
            className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-500"
          >
            Tambah Tugas
          </Link>
        </div>
      ) : (
        <CardView data={dataTasks} setData={setData} />
      )}
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item) => (
        <Card
          key={item.id}
          className="rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition duration-300"
          sx={{ backgroundColor: "#f9fafb", padding: "16px" }}
        >
          <CardContent className="space-y-2">
            <Typography variant="h6" className="font-semibold text-slate-800">
              {item.title}
            </Typography>
            <Typography className="text-sm text-slate-500">
              Kategori:
              <span className="ml-2 inline-block bg-indigo-500 text-white px-2 py-1 rounded-full text-xs">
                {item.category}
              </span>
              <span
                className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                  item.complete
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {item.complete ? "Selesai" : "Aktif"}
              </span>
            </Typography>
            <Typography className="text-sm text-slate-600">
              {item.content}
            </Typography>
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-400">
                {new Date(item.date).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold ${getPriorityStyle(
                  item.priority
                )}`}
              >
                {item.priority}
              </span>
            </div>
          </CardContent>
          <CardActions className="flex justify-end gap-2 pt-2">
            <Button onClick={() => handleFavorite(item.id, item.favorite)}>
              <Star
                size={18}
                fill={item.favorite ? "#facc15" : "none"}
                color={item.favorite ? "#facc15" : "#9ca3af"}
              />
            </Button>
            <Button component={Link} to={`/edit/${item.id}`}>
              <Edit size={18} />
            </Button>
            <Button onClick={() => handleDelete(item.id)}>
              <Trash2 size={18} />
            </Button>
            <Button
              onClick={() => handleToggleComplete(item.id, item.complete)}
            >
              {item.complete ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <Circle size={18} className="text-gray-400" />
              )}
            </Button>
          </CardActions>
        </Card>
      ))}
    </div>
  );
}

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
