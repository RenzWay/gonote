import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getTaskById, updateTask } from '../model/model';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Card, CardContent, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { EditIcon, Save, X } from 'lucide-react';

const priorityItem = ['Low', 'Medium', 'High', 'Urgent'];
const categoryItem = ['Personal', 'Work', 'School', 'Task', 'Other'];

const blueTheme = {
  gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
  gradientHover: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
};

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(dayjs());
  const [priority, setPriority] = useState('');
  const [category, setCategory] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const task = await getTaskById(id);
        if (task) {
          setTitle(task.title);
          setContent(task.content);
          setDate(dayjs(task.date?.toDate?.() || new Date()));
          setPriority(task.priority);
          setCategory(task.category);
          setFavorite(task.favorite || false);
          setComplete(task.complete || false);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Task Not Found',
            text: 'The task you are looking for does not exist.',
            confirmButtonColor: '#3b82f6',
          });
          navigate('/all');
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTask(id, {
        title,
        content,
        date: date.toDate(),
        priority,
        category,
        favorite,
        complete,
      });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Task updated successfully!',
        confirmButtonColor: '#3b82f6',
      }).then(() => {
        navigate('/all');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update task. Please try again.',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#F8FAFC',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}
    >
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: blueTheme.gradient,
          padding: '2rem 3rem 2rem 4.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Breadcrumbs
          sx={{
            '& a': {
              color: 'rgba(255,255,255,0.9)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            },
            '& a:hover': { color: 'white' },
          }}
        >
          <Link to="/">Dashboard</Link>
          <Link to="/all">All Tasks</Link>
          <Link to={`/edit/${id}`}>Edit Task</Link>
        </Breadcrumbs>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EditIcon />
          </div>
          <div>
            <h1
              style={{
                color: 'white',
                fontSize: '1.875rem',
                fontWeight: '700',
                margin: 0,
              }}
            >
              Edit Task
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              Update and adjust your task details
            </p>
          </div>
        </div>
      </motion.header>

      {/* Form Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          maxWidth: '800px',
          margin: '2rem auto',
          padding: '0 2rem',
        }}
      >
        <Card
          sx={{
            borderRadius: '16px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ padding: '2rem' }}>
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {/* Title */}
              <TextField
                label="Task Title"
                placeholder="Enter task title"
                variant="outlined"
                required
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />

              {/* Content */}
              <TextField
                label="Description"
                placeholder="Add task description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />

              {/* Priority & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priority}
                    label="Priority"
                    onChange={(e) => setPriority(e.target.value)}
                    sx={{ borderRadius: '12px' }}
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
                    label="Due Date"
                    format="YYYY-MM-DD"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              {/* Category */}
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                  sx={{ borderRadius: '12px' }}
                >
                  {categoryItem.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Checkboxes */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '2rem',
                  padding: '1rem',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={favorite}
                      onChange={(e) => setFavorite(e.target.checked)}
                      color="warning"
                    />
                  }
                  label="Mark as Favorite"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={complete}
                      onChange={(e) => setComplete(e.target.checked)}
                      color="success"
                    />
                  }
                  label="Mark as Complete"
                />
              </Box>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save size={20} />}
                  fullWidth
                  sx={{
                    background: blueTheme.gradient,
                    borderRadius: '12px',
                    padding: '0.75rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textTransform: 'none',
                    '&:hover': {
                      background: blueTheme.gradientHover,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                    },
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<X size={20} />}
                  onClick={() => navigate('/all')}
                  sx={{
                    borderRadius: '12px',
                    padding: '0.75rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textTransform: 'none',
                    borderColor: '#E2E8F0',
                    color: '#64748B',
                    '&:hover': {
                      borderColor: '#CBD5E1',
                      backgroundColor: '#F8FAFC',
                    },
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.section>
  );
}
