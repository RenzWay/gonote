import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar1Icon,
  ChartLine,
  CheckCircle,
  Clock,
  FileX,
  PlusSquare,
  SquareMenu,
  StarIcon,
} from 'lucide-react';
import Loading from '../lib/loading';
import { motion } from 'framer-motion';

import { getGonoteTask } from '../model/model';
import { checkTasksForToday } from '../utils';

const quickAction = [
  {
    to: '/add',
    title: 'Add Task',
    icon: <PlusSquare />,
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)',
    hoverGradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
  },
  {
    to: '/all',
    title: 'All Task',
    icon: <SquareMenu />,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    hoverGradient: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
  },
  {
    to: '/schedule',
    title: 'Scheduler',
    icon: <Calendar1Icon />,
    gradient: 'linear-gradient(135deg, #34d399 0%, #6ee7b7 100%)',
    hoverGradient: 'linear-gradient(135deg, #10b981 0%, #4ade80 100%)',
  },
];

const boxActivities = [
  {
    key: 'total',
    title: 'Total Task',
    filter: (tasks) => tasks.length,
    percent: (tasks) => 100,
    icon: <ChartLine size={32} color="#667eea" />,
    bgColor: '#EEF2FF',
    gradientBar: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  },
  {
    key: 'active',
    title: 'Active Task',
    filter: (tasks) => tasks.filter((t) => !t.complete).length,
    percent: (tasks) =>
      tasks.length === 0
        ? 0
        : Math.round((tasks.filter((t) => !t.complete).length / tasks.length) * 100),
    icon: <Clock size={32} color="#f97316" />,
    bgColor: '#FFF7ED',
    gradientBar: 'linear-gradient(90deg, #f97316 0%, #fb923c 100%)',
  },
  {
    key: 'complete',
    title: 'Complete Task',
    filter: (tasks) => tasks.filter((t) => t.complete).length,
    percent: (tasks) =>
      tasks.length === 0
        ? 0
        : Math.round((tasks.filter((t) => t.complete).length / tasks.length) * 100),
    icon: <CheckCircle size={32} color="#10b981" />,
    bgColor: '#ECFDF5',
    gradientBar: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
  },
  {
    key: 'favorite',
    title: 'Favorite Task',
    filter: (tasks) => tasks.filter((t) => t.favorite).length,
    percent: (tasks) =>
      tasks.length === 0
        ? 0
        : Math.round((tasks.filter((t) => t.favorite).length / tasks.length) * 100),
    icon: <StarIcon size={32} color="#eab308" />,
    bgColor: '#FEFCE8',
    gradientBar: 'linear-gradient(90deg, #eab308 0%, #facc15 100%)',
  },
];

export default function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasks = await getGonoteTask();
        setData(tasks);
        checkTasksForToday();
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };
    fetchData();
  }, []);

  const recentTasks = [...data]
    .map((t) => ({
      ...t,
      date: t.date?.toDate?.() ?? new Date(t.date),
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
          padding: '2.5rem 4.5rem',
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
          <Link to={'/'}>Dashboard</Link>
        </Breadcrumbs>
        <h1
          style={{
            fontSize: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: '700',
            color: 'white',
            marginTop: '0.75rem',
            marginBottom: '0.5rem',
            letterSpacing: '-0.025em',
          }}
        >
          <img src="/public/dashboard.png" width={50} alt="icon all task" />
          Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem' }}>
          Track your activity and manage your task efficiently
        </p>
      </motion.header>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          padding: '2rem',
          maxWidth: '1400px',
          margin: '0 auto',
          backgroundColor: '#F8FAFC',
          minHeight: 'calc(100vh - 180px)',
        }}
      >
        {/* Stats Cards */}
        <motion.section
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {boxActivities.map((item) => (
            <motion.div
              key={item.key}
              variants={itemVariants}
              whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.15)' }}
              style={{
                padding: '1.75rem',
                borderRadius: '16px',
                backgroundColor: 'white',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    {item.title}
                  </p>
                  <h5 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b' }}>
                    {item.filter(data)}
                  </h5>
                </div>
                <div
                  style={{
                    padding: '0.875rem',
                    borderRadius: '12px',
                    backgroundColor: item.bgColor,
                  }}
                >
                  {item.icon}
                </div>
              </div>

              <div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '999px',
                    overflow: 'hidden',
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent(data)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: item.gradientBar,
                      borderRadius: '999px',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.813rem', color: '#64748b', marginTop: '0.5rem' }}>
                  {item.percent(data)}% of total
                </p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* Quick Actions & Recent Tasks */}
        <motion.section
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '1.5rem 1.75rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                🚀 Quick Action
              </h3>
            </div>
            <div
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {quickAction.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    background: item.gradient,
                    color: 'white',
                    textDecoration: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = item.hoverGradient;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = item.gradient;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div
                    style={{
                      padding: '0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: '10px',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ fontWeight: '600', fontSize: '1rem' }}>{item.title}</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Tasks */}
          <motion.div
            variants={itemVariants}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1.5rem 1.75rem',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                📋 Recent Task
              </h3>
            </div>

            <div style={{ padding: '1.5rem', flex: 1 }}>
              {loading ? (
                <Loading bolean={true} />
              ) : recentTasks.length === 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 1rem',
                    textAlign: 'center',
                    color: '#94a3b8',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: '#f1f5f9',
                      padding: '1.5rem',
                      borderRadius: '50%',
                      marginBottom: '1rem',
                    }}
                  >
                    <FileX size={48} color="#cbd5e1" />
                  </div>
                  <p
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#64748b',
                      margin: '0.5rem 0',
                    }}
                  >
                    There are no tasks
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
                    Please add task first
                  </p>
                  <Link
                    to="/add"
                    style={{
                      display: 'inline-block',
                      padding: '0.75rem 1.5rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 12px -2px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    Add Task
                  </Link>
                </div>
              ) : (
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {recentTasks.map((task, index) => (
                    <motion.li
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4, scale: 1.02 }}
                      style={{ listStyle: 'none' }}
                    >
                      <Link
                        to={'/all'}
                        style={{
                          display: 'block',
                          padding: '1.25rem',
                          borderLeft: '4px solid #667eea',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          textDecoration: 'none',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                      >
                        <h5
                          style={{
                            fontWeight: '600',
                            color: '#1e293b',
                            fontSize: '1rem',
                            marginBottom: '0.5rem',
                          }}
                        >
                          {task.title}
                        </h5>
                        <p
                          style={{
                            fontSize: '0.875rem',
                            color: '#64748b',
                            marginBottom: '0.75rem',
                            lineHeight: '1.5',
                          }}
                        >
                          {task.content}
                        </p>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            fontStyle: 'italic',
                          }}
                        >
                          {new Date(task.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '1rem',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <Link
                to="/all"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#667eea',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '0.938rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.gap = '0.75rem';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.gap = '0.5rem';
                }}
              >
                <span>View All Tasks</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </motion.section>
      </motion.section>
    </>
  );
}
