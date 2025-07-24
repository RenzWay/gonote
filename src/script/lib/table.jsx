// TABEL TASK
function TableTask({ data, setData }) {
  const handleDelete = async (id) => {
    await deleteTask(id);
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleFavorite = async (id, currentValue) => {
    await toggleFavorite(id, currentValue);
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item)),
    );
  };

  const headTable = ['No', 'Title', 'Category', 'Date', 'Priority', 'Actions'];

  return (
    <div className="overflow-auto -mx-4 sm:mx-0">
      <TableContainer component={Paper} className="shadow-sm mt-6 min-w-[800px] sm:min-w-0">
        <Table>
          <TableHead>
            <TableRow className="bg-light">
              {headTable.map((row) => (
                <TableCell
                  key={row}
                  className="font-semibold"
                  sx={{
                    minWidth: row === 'Title' ? 250 : 'auto',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={row.id} className="hover:bg-gray-50 transition-colors">
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{row.title}</div>
                  <div className="text-sm text-muted line-clamp-2 max-w-md">{row.content}</div>
                </TableCell>
                <TableCell>
                  <span className="badge bg-primary">{row.category}</span>
                </TableCell>
                <TableCell>{row.date?.toDate?.().toLocaleDateString?.() || 'Unknown'}</TableCell>
                <TableCell>
                  <span className={`badge ${getPriorityStyle(row.priority)}`}>{row.priority}</span>
                </TableCell>
                <TableCell>
                  <div className="d-flex gap-1 sm:gap-2 flex-nowrap">
                    <button
                      onClick={() => handleFavorite(row.id, row.favorite)}
                      className="btn btn-light btn-sm rounded-circle p-1"
                    >
                      <Star
                        size={16}
                        color={row.favorite ? '#facc15' : '#9ca3af'}
                        fill={row.favorite ? '#facc15' : 'none'}
                      />
                    </button>
                    <button className="btn btn-light btn-sm rounded-circle p-1">
                      <Edit size={16} className="text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(row.id)}
                      className="btn btn-light btn-sm rounded-circle p-1"
                    >
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
