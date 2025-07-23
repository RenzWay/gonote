import React, { useState, useEffect } from "react";
import { addGonoteTask } from "../model/model";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Swal from "sweetalert2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";

const priorityItem = [
  { name: "Low" },
  { name: "Medium" },
  { name: "High" },
  { name: "Urgent" },
];

const categoryItem = ["Personal", "Work", "School", "Task", "Other"];

export default function AddTaskPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(dayjs());
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleNavigate = () => {
    Swal.fire({
      title: "Sukses!",
      text: "Task berhasil ditambahkan!",
      icon: "success",
      confirmButtonText: "Lihat Task",
    }).then((result) => {
      navigate("/all");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(title, content, date, priority, category);
    const gonoteAdd = await addGonoteTask(
      title,
      content,
      date ? date.toDate() : null,
      priority,
      category,
      favorite,
      complete
    );

    if (gonoteAdd) {
      handleNavigate();
    } else {
      Swal.fire({
        icon: "error",
        text: "tidak berhasil ada kegagalan",
      });
    }

    setTitle("");
    setCategory("");
    setContent("");
    setDate(null);
    setPriority("");
    setFavorite(false);
    setComplete(false);
  };
  return (
    <section className=" bg-gray-50/30 " role="body">
      <header className="text-center py-5 bg-gradient-to-r from-blue-50 to-purple-50 mb-8">
        <h1 className="text-2xl flex gap-1 justify-content-center font-bold text-gray-800 mb-2">
          <img src="/public/add.png" width={50} alt="icon all task" />
          Add New Task
        </h1>
        <p className="text-gray-600">
          Create a new task to stay organized and productive
        </p>
      </header>

      <section className="flex justify-center ">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:space-y-6"
          id="addTaskForm"
        >
          <TextField
            color="info"
            variant="outlined"
            placeholder="Add your title"
            size="small"
            label="Title"
            required
            fullWidth
            className="bg-white/80 backdrop-blur-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            color="info"
            variant="outlined"
            placeholder="Add your content"
            size="medium"
            label="Content"
            fullWidth
            multiline
            rows={4}
            className="bg-white/80 backdrop-blur-sm"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectControl priority={priority} setPriority={setPriority} />
            <DateControl date={date} setDate={setDate} />
            <CategoryControl
              className="col-span-full bg-white/80 backdrop-blur-sm"
              setCategory={setCategory}
              category={category}
            />
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

          <hr />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full py-3 text-lg font-medium mt-4 "
          >
            Add Task
          </Button>
        </form>
      </section>
    </section>
  );
}

function SelectControl({ priority, setPriority }) {
  //   const [priority, setPriority] = useState("");
  return (
    <FormControl fullWidth>
      <InputLabel id="priorityLabel">Priority</InputLabel>
      <Select
        className=" text-gray-950"
        labelId="priorityLabel"
        color="primary"
        variant="outlined"
        value={priority}
        label="Priority"
        onChange={(e) => {
          setPriority(e.target.value);
        }}
      >
        {priorityItem.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function CategoryControl({ className, category, setCategory }) {
  return (
    <FormControl className={className}>
      <InputLabel id="Item">Category</InputLabel>
      <Select
        className=" text-gray-950"
        labelId="priorityLabel"
        color="primary"
        variant="outlined"
        value={category}
        label="Priority"
        onChange={(e) => {
          setCategory(e.target.value);
        }}
      >
        {categoryItem.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function DateControl({ date, setDate }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        format="YYYY-MM-DD"
        value={date}
        onChange={(newValue) => setDate(newValue)}
        slotProps={{ textField: { fullWidth: true } }}
        defaultValue={date}
      />
    </LocalizationProvider>
  );
}
