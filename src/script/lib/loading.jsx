import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function Loading({ bolean }) {
  if (!bolean) return null; // jika false, tidak render apa-apa

  return (
    <div className="flex items-center justify-center p-4">
      <CircularProgress />
    </div>
  );
}
