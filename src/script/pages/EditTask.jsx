import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTaskById, updateTask } from "../model/model";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const priorityItem = ["Low", "Medium", "High", "Urgent"];
const categoryItem = ["Personal", "Work", "School", "Task", "Other"];

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(dayjs());
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const task = await getTaskById(id);
      if (task) {
        setTitle(task.title);
        setContent(task.content);
        setDate(dayjs(task.date?.toDate?.() || new Date()));
        setPriority(task.priority);
        setCategory(task.category);
        setFavorite(task.favorite || false);
        setComplete(task.complete || false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTask(id, {
      title,
      content,
      date: date.toDate(),
      priority,
      category,
      favorite,
      complete,
    });
    navigate("/all");
  };

  return (
    <section className="bg-gray-50/30">
      <header className="text-center py-5 bg-gradient-to-r from-blue-50 to-purple-50 mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Task</h1>
        <p className="text-gray-600">Update and adjust your task</p>
      </header>

      <section className="flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:space-y-6"
          id="editTaskForm"
        >
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {priorityItem.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <FormControl className="col-span-full">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categoryItem.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <Box className="flex justify-between items-center px-2">
            <FormControlLabel
              control={
                <Checkbox
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                  color="warning"
                />
              }
              label="Favorite"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={complete}
                  onChange={(e) => setComplete(e.target.checked)}
                  color="success"
                />
              }
              label="Complete"
            />
          </Box>

          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </form>
      </section>
    </section>
  );
}
