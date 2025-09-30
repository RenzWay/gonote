import { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material';
import { BookOpen, Clock, Edit, Plus, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  addDaySchedule,
  deleteDaySchedule,
  getDaySchedule,
  updateDaySchedule,
} from '../model/model';

const nameDay = [
  { day: 'Senin', color: '#3B82F6', bgLight: '#EFF6FF' },
  { day: 'Selasa', color: '#8B5CF6', bgLight: '#F5F3FF' },
  { day: 'Rabu', color: '#EC4899', bgLight: '#FDF2F8' },
  { day: 'Kamis', color: '#F59E0B', bgLight: '#FFFBEB' },
  { day: 'Jumat', color: '#10B981', bgLight: '#ECFDF5' },
  { day: 'Sabtu', color: '#06B6D4', bgLight: '#ECFEFF' },
  { day: 'Minggu', color: '#EF4444', bgLight: '#FEF2F2' },
];

export default function SchedulerPage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    timeStart: '',
    timeEnd: '',
    subject: '',
    description: '',
  });

  // load schedule
  const loadSchedule = async () => {
    setLoading(true);
    const data = await getDaySchedule();
    setSchedule(data);
    setLoading(false);
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const handleOpenDialog = (day, schedule = null) => {
    if (schedule) {
      // Parse existing time format "08:00 - 10:00" to separate start and end
      const timeParts = schedule.time.split(' - ');
      setEditingSchedule(schedule);
      setFormData({
        day: schedule.day,
        timeStart: timeParts[0] || '',
        timeEnd: timeParts[1] || '',
        subject: schedule.subject,
        description: schedule.description || '',
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        day,
        timeStart: '',
        timeEnd: '',
        subject: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
  };

  const handleSave = async () => {
    // Combine timeStart and timeEnd into the "HH:MM - HH:MM" format
    const timeFormatted = `${formData.timeStart} - ${formData.timeEnd}`;

    const data = {
      day: formData.day,
      time: timeFormatted,
      subject: formData.subject,
      description: formData.description,
    };

    try {
      if (editingSchedule) {
        await updateDaySchedule(editingSchedule.id, data);
      } else {
        await addDaySchedule(data);
      }
      await loadSchedule();
      handleCloseDialog();
    } catch (e) {
      console.error('Error saving:', e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin hapus jadwal ini?')) return;
    try {
      await deleteDaySchedule(id);
      await loadSchedule();
    } catch (e) {
      console.error('Error deleting:', e);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const scheduleItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}
    >
      {/* Header dengan gradient modern */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2em 3em 2em 4.5em',
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
          <Link to="/schedule">Scheduler</Link>
        </Breadcrumbs>
        <h1
          style={{
            color: 'white',
            fontSize: '1.875rem',
            fontWeight: '700',
            marginTop: '0.5rem',
            letterSpacing: '-0.025em',
          }}
        >
          Weekly Scheduler
        </h1>
      </motion.header>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '4rem 0' }}
        >
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Loading...</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            padding: '2rem',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          {nameDay.map((day, index) => {
            const daySchedules = schedule.filter((s) => s.day === day.day);

            return (
              <motion.div key={day.day} variants={cardVariants}>
                <Card
                  sx={{
                    borderRadius: '16px',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardHeader
                    sx={{
                      background: `linear-gradient(135deg, ${day.color} 0%, ${day.color}dd 100%)`,
                      color: 'white',
                      padding: '1.25rem 1.5rem',
                      '& .MuiCardHeader-title': {
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        letterSpacing: '-0.025em',
                      },
                    }}
                    title={day.day}
                    action={
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(day.day)}
                        sx={{
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          transition: 'all 0.2s',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            transform: 'rotate(90deg)',
                          },
                        }}
                      >
                        <Plus size={20} />
                      </IconButton>
                    }
                  />
                  <CardContent sx={{ padding: '1.5rem' }}>
                    {daySchedules.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{
                          textAlign: 'center',
                          padding: '2rem 1rem',
                          color: '#94a3b8',
                          backgroundColor: day.bgLight,
                          borderRadius: '12px',
                        }}
                      >
                        <BookOpen size={40} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                        <p style={{ fontStyle: 'italic', fontSize: '0.875rem' }}>
                          Belum ada jadwal
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.05,
                            },
                          },
                        }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                      >
                        {daySchedules.map((s) => (
                          <motion.div
                            key={s.id}
                            variants={scheduleItemVariants}
                            whileHover={{ x: 4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              padding: '1rem',
                              borderLeft: `4px solid ${day.color}`,
                              backgroundColor: day.bgLight,
                              borderRadius: '8px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  marginBottom: '0.25rem',
                                }}
                              >
                                <Clock size={14} style={{ color: day.color }} />
                                <span
                                  style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#64748b',
                                  }}
                                >
                                  {s.time}
                                </span>
                              </div>
                              <p
                                style={{
                                  fontWeight: '600',
                                  fontSize: '0.938rem',
                                  color: '#1e293b',
                                  marginBottom: '0.25rem',
                                }}
                              >
                                {s.subject}
                              </p>
                              {s.description && (
                                <p
                                  style={{
                                    fontSize: '0.813rem',
                                    color: '#64748b',
                                    lineHeight: '1.4',
                                  }}
                                >
                                  {s.description}
                                </p>
                              )}
                            </div>
                            <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDialog(day.day, s)}
                                sx={{
                                  color: '#64748b',
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    color: day.color,
                                    backgroundColor: 'rgba(0,0,0,0.05)',
                                    transform: 'scale(1.1)',
                                  },
                                }}
                              >
                                <Edit size={16} />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(s.id)}
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
                                <Trash size={16} />
                              </IconButton>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Dialog add/edit dengan Time Range Picker */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: '0.5rem',
          },
        }}
        TransitionProps={{
          onEntering: (node) => {
            node.style.transition = 'all 0.3s ease-out';
          },
        }}
      >
        <DialogTitle sx={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>
          {editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal'}
        </DialogTitle>
        <DialogContent sx={{ paddingTop: '1.5rem !important' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Hari Field */}
            <TextField label="Hari" value={formData.day} fullWidth disabled variant="outlined" />

            {/* Time Range Fields */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <TextField
                label="Waktu Mulai"
                type="time"
                value={formData.timeStart}
                onChange={(e) => setFormData({ ...formData, timeStart: e.target.value })}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min intervals
                }}
              />
              <span style={{ color: '#64748b', fontWeight: '600' }}>—</span>
              <TextField
                label="Waktu Selesai"
                type="time"
                value={formData.timeEnd}
                onChange={(e) => setFormData({ ...formData, timeEnd: e.target.value })}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  step: 300, // 5 min intervals
                }}
              />
            </div>

            {/* Subject Field */}
            <TextField
              label="Mata Kuliah / Kegiatan"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              fullWidth
              required
              variant="outlined"
            />

            {/* Description Field */}
            <TextField
              label="Deskripsi (opsional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              fullWidth
              multiline
              rows={3}
              variant="outlined"
            />
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: '1rem 1.5rem' }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: '#64748b',
              transition: 'all 0.2s',
              '&:hover': { backgroundColor: '#F1F5F9' },
            }}
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.timeStart || !formData.timeEnd || !formData.subject}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '8px',
              textTransform: 'none',
              padding: '0.5rem 1.5rem',
              fontWeight: '600',
              transition: 'all 0.2s',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #63407a 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              },
              '&:disabled': {
                background: '#e2e8f0',
                color: '#94a3b8',
              },
            }}
          >
            {editingSchedule ? 'Update' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </motion.section>
  );
}
