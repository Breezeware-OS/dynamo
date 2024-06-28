import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DraggableComponent({
  children,
  index,
  onDragStart,
  onDragEnter,
  onDragEnd,
  style,
}) {
  const handleDragStart = event => {
    onDragStart(index); // Log index of the component being dragged
    event.dataTransfer.setData('text/plain', index);
  };

  const handleDragEnter = event => {
    event.preventDefault();
    onDragEnter(event, index); // Log index of the component over which it's being dragged
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnter={handleDragEnter}
      onDragEnd={onDragEnd}
      style={{
        margin: '15px',
        // padding: '6px',
        borderRadius: '5px',
        ...style,
      }}>
      {children}
    </div>
  );
}
