import React from 'react';

const TextArea = ({...props}) => {
  return (
    <textarea
      style={{
        outline: 'none',
        border: 'none',
        background: 'transparent',
        resize: 'none',
        width: '100%',
        height: '40px',
        fontSize: '22px',
        boxSizing: 'border-box',
      }}
      {...props}
    />
  );
};

export default TextArea;
