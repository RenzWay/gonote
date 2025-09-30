// Warna biru untuk konsisten dengan tema
export const blueTheme = {
  primary: '#3B82F6',
  primaryLight: '#EFF6FF',
  primaryDark: '#1D4ED8',
  gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
  gradientHover: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
};

export const getPriorityStyle = (priority) => {
  const styles = {
    Low: { color: '#10B981', bgLight: '#ECFDF5', border: '#10B981' },
    Medium: { color: '#F59E0B', bgLight: '#FFFBEB', border: '#F59E0B' },
    High: { color: '#EF4444', bgLight: '#FEF2F2', border: '#EF4444' },
    Urgent: { color: '#DC2626', bgLight: '#FEE2E2', border: '#DC2626' },
  };
  return styles[priority] || { color: '#6B7280', bgLight: '#F3F4F6', border: '#6B7280' };
};

// Styling constants
export const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
  },
  header: {
    background: blueTheme.gradient,
    padding: '2em 3em 2em 4.5em',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '0.5rem',
    flexWrap: 'wrap',
  },
  headerIcon: {
    width: '50px',
    height: '50px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: '1.875rem',
    fontWeight: '700',
    letterSpacing: '-0.025em',
    margin: 0,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    margin: 0,
  },
  searchSection: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    margin: '2rem 1rem',
    maxWidth: '1400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 0px 5px 0 rgb(0 0 0 / 0.1)',
  },
  searchGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  addButtonContainer: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '4rem 0',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    margin: '0 2rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  },
  tasksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    padding: '0 1rem 2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
};

// Animation variants sama seperti di Schedule
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const cardVariants = {
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

// Card styles untuk Material-UI sx prop
export const getCardStyle = (isComplete) => ({
  borderRadius: '16px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  border: 'none',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  background: isComplete
    ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  '&:hover': {
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-4px)',
  },
});
