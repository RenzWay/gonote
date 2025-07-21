import React, { useState, useEffect } from "react";
import { addGonoteTask } from "../model/model";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const priorityItem = [
  { name: "Low" },
  { name: "Medium" },
  { name: "High" },
  { name: "Urgent" },
];

const categoryItem = ["Personal", "Work", "School", "Task", "Other"];

export default function AddTaskPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(dayjs());
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(title, content, date, priority, category);
    const gonoteAdd = addGonoteTask(
      title,
      content,
      date ? date.toDate() : null,
      priority,
      category
    );

    if (gonoteAdd) {
      alert("berhasil");
    } else {
      alert("gagal maseh");
    }

    setTitle("");
    setCategory("");
    setContent("");
    setDate(null);
    setPriority("");
  };
  return (
    <section className=" bg-gray-50/30 " role="body">
      <header className="text-center py-5">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Task</h1>
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
        value={date}
        onChange={(newValue) => setDate(newValue)}
        slotProps={{ textField: { fullWidth: true } }}
        defaultValue={date}
      />
    </LocalizationProvider>
  );
}
