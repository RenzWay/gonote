import React, { useState } from 'react';

export default function TestPage() {
  const [value, setValue] = useState('');

  return (
    <section>
      <ReactQuill theme="snow" value={value} onChange={setValue} />;
    </section>
  );
}
