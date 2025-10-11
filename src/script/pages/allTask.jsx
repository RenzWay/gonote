import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { blueTheme, containerVariants, getPriorityStyle, styles } from '../lib/styles';
import { CheckCircle, Circle, Clock, Edit, FileX, Plus, Star, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteTask, getGonoteTask, toggleComplete, toggleFavorite } from '../model/model';
import Loading from '../lib/loading';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { motion } from 'framer-motion';

// Helper function untuk convert HTML ke plain text (untuk search)
function stripHtmlTags(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

// Helper function untuk truncate HTML
function truncateHTML(html, maxLength = 200) {
  const text = stripHtmlTags(html);
  if (text.length <= maxLength) return html;

  // Potong HTML sampai mendekati max length
  const div = document.createElement('div');
  div.innerHTML = html;

  // Ambil text content dan potong
  const truncatedText = text.substring(0, maxLength);

  // Cari posisi terakhir di HTML yang mendekati panjang truncated text
  let tempDiv = document.createElement('div');
  let currentLength = 0;
  let result = '';

  // Simple truncation - ambil substring dari HTML
  return html.substring(0, Math.min(html.length, maxLength * 2)) + '...';
}

export default function AllTask() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allStatus, setAllStatus] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, task: null });

  const filteredData = data
    .filter((item) => {
      if (allStatus === 'Complete') return item.complete === true;
      if (allStatus === 'Active') return item.complete === false;
      return true;
    })
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const plainContent = stripHtmlTags(item.content);
      return (
        item.title.toLowerCase().includes(q) ||
        plainContent.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case 'Sort by priority': {
        const priorityOrder = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      case 'Sort by name':
        return a.title.localeCompare(b.title);
      case 'Sort by date':
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

  const handleDeleteConfirm = async () => {
    if (deleteDialog.task) {
      await deleteTask(deleteDialog.task.id);
      setData((prev) => prev.filter((item) => item.id !== deleteDialog.task.id));
      setDeleteDialog({ open: false, task: null });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.container}
    >
      {/* CSS Global untuk styling HTML content */}
      <style>{`
        .task-content-preview h1,
        .task-content-preview h2,
        .task-content-preview h3,
        .task-content-preview h4,
        .task-content-preview h5,
        .task-content-preview h6 {
          font-weight: 700;
          margin: 0.3em 0;
          line-height: 1.3;
        }
        .task-content-preview h1 { font-size: 1.25em; }
        .task-content-preview h2 { font-size: 1.15em; }
        .task-content-preview h3 { font-size: 1.05em; }
        .task-content-preview h4,
        .task-content-preview h5,
        .task-content-preview h6 { font-size: 1em; }
        
        .task-content-preview p {
          margin: 0.3em 0;
          line-height: 1.6;
        }
        .task-content-preview strong { font-weight: 700; }
        .task-content-preview em { font-style: italic; }
        .task-content-preview u { text-decoration: underline; }
        
        .task-content-preview ul,
        .task-content-preview ol {
          padding-left: 1.5em;
          margin: 0.3em 0;
        }
        .task-content-preview li {
          margin: 0.2em 0;
        }
        
        .task-content-preview blockquote {
          border-left: 3px solid #cbd5e1;
          padding-left: 1em;
          margin: 0.5em 0;
          font-style: italic;
          color: #64748b;
        }
        
        .task-content-preview a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .task-content-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 0.5em 0;
        }
      `}</style>

      {/* Header dengan gradient yang sama seperti Schedule */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={styles.header}
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
        </Breadcrumbs>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>
            <img src="/public/check-list.png" width={30} alt="icon all task" />
          </div>
          <div>
            <h1 style={styles.headerTitle}>All Tasks</h1>
            <p style={styles.headerSubtitle}>Manage and organize all your tasks here</p>
          </div>
        </div>
      </motion.header>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={styles.searchSection}
      >
        <div style={styles.searchGrid}>
          <TextField
            label="🔍 Search Task"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
          />
          <ControlSearch
            title="Filter Status"
            ArrayData={['None', 'Active', 'Complete']}
            data={allStatus}
            setData={(e) => setAllStatus(e.target.value)}
          />
          <ControlSearch
            title="Sort By"
            ArrayData={['None', 'Sort by date', 'Sort by priority', 'Sort by name']}
            data={sortBy}
            setData={(e) => setSortBy(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Add Task Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={styles.addButtonContainer}
      >
        <Button
          component={Link}
          to="/add"
          variant="contained"
          startIcon={<Plus size={20} />}
          sx={{
            background: blueTheme.gradient,
            borderRadius: '12px',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            fontWeight: '600',
            textTransform: 'none',
            transition: 'all 0.2s',
            '&:hover': {
              background: blueTheme.gradientHover,
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
            },
          }}
        >
          Add New Task
        </Button>
      </motion.div>

      {/* Tasks Grid */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.loadingContainer}
        >
          <Loading bolean={true} />
        </motion.div>
      ) : dataTasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.emptyState}
        >
          <FileX size={60} style={{ margin: '0 auto 1rem', color: '#94a3b8', opacity: 0.5 }} />
          <p
            style={{
              color: '#64748b',
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
            }}
          >
            There are no tasks yet
          </p>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Please add the task first</p>
          <Button
            component={Link}
            to="/add"
            variant="contained"
            startIcon={<Plus size={20} />}
            sx={{
              background: blueTheme.gradient,
              borderRadius: '12px',
              padding: '0.75rem 2rem',
              '&:hover': {
                background: blueTheme.gradientHover,
                transform: 'translateY(-2px)',
              },
            }}
          >
            Add Task
          </Button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={styles.tasksGrid}
        >
          {dataTasks.map((item, index) => (
            <TaskCard
              key={item.id}
              item={item}
              onUpdate={setData}
              onDeleteClick={(task) => setDeleteDialog({ open: true, task })}
            />
          ))}
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, task: null })}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '0.5rem',
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <p style={{ color: '#64748b' }}>
            Are you sure you want to delete "{deleteDialog.task?.title}"? This action cannot be
            undone.
          </p>
        </DialogContent>
        <DialogActions sx={{ padding: '1rem 1.5rem' }}>
          <Button
            onClick={() => setDeleteDialog({ open: false, task: null })}
            sx={{
              color: '#64748b',
              transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#F1F5F9' },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              padding: '0.5rem 1.5rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </motion.section>
  );
}

function TaskCard({ item, variants, onUpdate, onDeleteClick }) {
  const priorityStyle = getPriorityStyle(item.priority);

  const handleFavorite = async (id, currentValue) => {
    await toggleFavorite(id, currentValue);
    onUpdate((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item)),
    );
  };

  const handleToggleComplete = async (id, currentValue) => {
    onUpdate((prev) =>
      prev.map((item) => (item.id === id ? { ...item, complete: !item.complete } : item)),
    );

    try {
      await toggleComplete(id, currentValue);
    } catch (err) {
      console.error('Gagal update ke Firestore', err);
      onUpdate((prev) =>
        prev.map((item) => (item.id === id ? { ...item, complete: currentValue } : item)),
      );
    }
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Card>
        <CardContent sx={{ padding: '1.5rem' }}>
          {/* Header dengan title dan favorite */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: '700',
                color: item.complete ? '#94a3b8' : '#1e293b',
                textDecoration: item.complete ? 'line-through' : 'none',
                flex: 1,
                marginRight: '1rem',
              }}
            >
              {item.title}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleFavorite(item.id, item.favorite)}
              sx={{
                color: item.favorite ? '#F59E0B' : '#94a3b8',
                transition: 'all 0.2s',
                '&:hover': {
                  color: '#F59E0B',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Star size={20} fill={item.favorite ? 'currentColor' : 'none'} />
            </IconButton>
          </div>

          {/* Content - Render HTML dengan styling yang proper */}
          <div
            className="task-content-preview"
            style={{
              color: item.complete ? '#94a3b8' : '#64748b',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              maxHeight: '100px',
              overflow: 'hidden',
              position: 'relative',
            }}
            dangerouslySetInnerHTML={{ __html: truncateHTML(item.content, 200) }}
          />

          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: blueTheme.primaryLight,
                color: blueTheme.primaryDark,
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              {item.category}
            </span>
            <span
              style={{
                backgroundColor: priorityStyle.bgLight,
                color: priorityStyle.color,
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
                border: `1px solid ${priorityStyle.border}20`,
              }}
            >
              {item.priority}
            </span>
            <span
              style={{
                backgroundColor: item.complete ? '#D1FAE5' : '#FEF3C7',
                color: item.complete ? '#065F46' : '#92400E',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              {item.complete ? 'Complete' : 'Active'}
            </span>
          </div>

          {/* Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8' }}>
            <Clock size={14} />
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              {new Date(item.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
          </div>
        </CardContent>

        {/* Actions */}
        <CardActions
          sx={{
            padding: '0 1.5rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <IconButton
              size="small"
              component={Link}
              to={`/edit/${item.id}`}
              sx={{
                color: '#64748b',
                transition: 'all 0.2s',
                '&:hover': {
                  color: blueTheme.primary,
                  backgroundColor: blueTheme.primaryLight,
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Edit size={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDeleteClick(item)}
              sx={{
                color: '#64748b',
                transition: 'all 0.2s',
                '&:hover': {
                  color: '#EF4444',
                  backgroundColor: '#FEE2E2',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          </div>

          <IconButton
            size="small"
            onClick={() => handleToggleComplete(item.id, item.complete)}
            sx={{
              color: item.complete ? '#10B981' : '#94a3b8',
              transition: 'all 0.2s',
              '&:hover': {
                color: item.complete ? '#059669' : blueTheme.primary,
                backgroundColor: item.complete ? '#D1FAE5' : blueTheme.primaryLight,
                transform: 'scale(1.1)',
              },
            }}
          >
            {item.complete ? <CheckCircle size={20} /> : <Circle size={20} />}
          </IconButton>
        </CardActions>
      </Card>
    </motion.div>
  );
}

function ControlSearch({ title, ArrayData, setData, data, className = '' }) {
  return (
    <FormControl fullWidth className={className}>
      <InputLabel id={`${title}-label`}>{title}</InputLabel>
      <Select
        labelId={`${title}-label`}
        value={data}
        label={title}
        onChange={setData}
        sx={{
          borderRadius: '8px',
        }}
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
