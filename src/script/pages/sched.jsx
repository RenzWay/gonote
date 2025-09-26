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
import { Edit, Plus, Trash } from 'lucide-react';
import {
  addDaySchedule,
  deleteDaySchedule,
  getDaySchedule,
  updateDaySchedule,
} from '../model/model';

const nameDay = [
  { day: 'Senin' },
  { day: 'Selasa' },
  { day: 'Rabu' },
  { day: 'Kamis' },
  { day: 'Jumat' },
  { day: 'Sabtu' },
  { day: 'Minggu' },
];

export default function SchedulerPage() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    time: '',
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
      setEditingSchedule(schedule);
      setFormData({
        day: schedule.day,
        time: schedule.time,
        subject: schedule.subject,
        description: schedule.description || '',
      });
    } else {
      setEditingSchedule(null);
      setFormData({
        day,
        time: '',
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
    const data = {
      day: formData.day,
      time: formData.time,
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

  return (
    <section>
      <header className="px-20 py-8 bg-blue-300">
        <Breadcrumbs>
          <Link to="/">Dashboard</Link>
          <Link to="/schedule">Scheduler</Link>
        </Breadcrumbs>
        <h1 className="text-primary text-xl font-semibold">Weekly Scheduler</h1>
      </header>

      {loading ? (
        <p className="text-center py-8">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {nameDay.map((day) => {
            const daySchedules = schedule.filter((s) => s.day === day.day);

            return (
              <Card key={day.day}>
                <CardHeader
                  title={day.day}
                  action={
                    <IconButton size="small" onClick={() => handleOpenDialog(day.day)}>
                      <Plus />
                    </IconButton>
                  }
                />
                <CardContent>
                  {daySchedules.length === 0 ? (
                    <p className="text-gray-500 italic">Belum ada jadwal</p>
                  ) : (
                    daySchedules.map((s) => (
                      <div
                        key={s.id}
                        className="mb-2 p-2 border-l-4 border-blue-500 bg-gray-50 rounded flex justify-between"
                      >
                        <div>
                          <p className="font-semibold text-sm">
                            {s.time} — {s.subject}
                          </p>
                          {s.description && (
                            <p className="text-xs text-gray-600">{s.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <IconButton size="small" onClick={() => handleOpenDialog(day.day, s)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(s.id)}>
                            <Trash className="text-red-600" />
                          </IconButton>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialog add/edit */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingSchedule ? 'Edit Jadwal' : 'Tambah Jadwal'}</DialogTitle>
        <DialogContent className="space-y-4 mt-4">
          <TextField label="Hari" value={formData.day} fullWidth disabled />
          <TextField
            label="Waktu (contoh: 08:00 - 10:00)"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Mata Kuliah / Kegiatan"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Deskripsi (opsional)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={!formData.time || !formData.subject}
          >
            {editingSchedule ? 'Update' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
