import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Plus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Edit, Star, Trash2 } from "lucide-react";
import Button from "@mui/material/Button";

import { getGonoteTask, deleteTask, toggleFavorite } from "../model/model";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../model/firebase";

export default function AllTask() {
  const [allStatus, setAllStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"
  return (
    <section className="container-lg mt-4 sm:mt-10 px-4 sm:px-6">
      <header className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">All Task</h1>
          <h6 className="text-gray-600 text-sm sm:text-base">
            Manage and organize your task list
          </h6>
        </div>
        <Link
          className="bg-blue-400 p-2 sm:p-3 rounded-1 text-light text-decoration-none flex gap-2 items-center justify-center sm:justify-start w-full sm:w-auto"
          to={"/add"}
        >
          <Plus size={20} />
          Add Task
        </Link>
      </header>

      <div className="w-full mt-6 sm:mt-10 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 flex-grow">
            <TextField
              className="col-span-3"
              label="🔍 Search"
              fullWidth
              type="search"
              size="small"
            />

            <ControlSearch
              title="Status Filter"
              ArrayData={["Active", "Complete"]}
              setData={(e) => setAllStatus(e.target.value)}
              data={allStatus}
            />
            <ControlSearch
              title="Sort By"
              ArrayData={["Sort by date", "Sort by priority", "Sort by name"]}
              setData={(e) => setSortBy(e.target.value)}
              data={sortBy}
            />
          </div>
        </div>
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

        {viewMode === "table" ? (
          <TableTask />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
            <CardView />
          </div>
        )}
      </div>
    </section>
  );
}

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

function TableTask() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getGonoteTask().then(setData);
  }, []);

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

  const priorityItem = [
    { name: "Low" },
    { name: "Medium" },
    { name: "High" },
    { name: "Urgent" },
  ];

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
                <TableCell className="whitespace-nowrap">{idx + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{row.title}</div>
                  <div className="text-sm text-muted line-clamp-2 max-w-xs">
                    {row.content}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="badge bg-primary text-nowrap d-inline-block">
                    {row.category}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {row.date?.toDate?.().toLocaleDateString?.() || "Unknown"}
                </TableCell>
                <TableCell className="whitespace-nowrap">
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

function CardView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getGonoteTask().then(setData);
  }, []);

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

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "task"), (snapshot) => {
      setData(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <>
      {data.map((item) => (
        <Card
          key={item.id}
          className="shadow-md border border-gray-100 rounded-xl transition-all hover:scale-[1.01]"
          sx={{ backgroundColor: "#fff", padding: "16px" }}
        >
          <CardContent className="space-y-2">
            <Typography
              variant="h6"
              component="div"
              className="font-bold text-gray-800"
            >
              {item.title}
            </Typography>
            <Typography className="text-sm text-gray-600">
              Category: <span className="font-medium">{item.category}</span>
            </Typography>
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
            <div
              onClick={() => {
                handleFavorite(item.id);
              }}
            >
              <Button color="warning">
                <Star fill={item.favorite ? "#facc15" : "none"} />
              </Button>
            </div>
            <div>
              <Button
                color="error"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-red-500"
                aria-label="delete"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 size={18} />
              </Button>
              <Button
                color="success"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-blue-500"
                aria-label="edit"
              >
                <Edit size={18} />
              </Button>
            </div>
          </CardActions>
        </Card>
      ))}
    </>
  );
}

function ControlSearch({ title, ArrayData, setData, data }) {
  return (
    <FormControl fullWidth>
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
