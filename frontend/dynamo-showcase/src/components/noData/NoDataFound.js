import {Text} from 'glide-design-system';
import React from 'react';

const NoDataFound = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'left',
        width: '100%',
        height: '40px',
        alignItems: 'center',
      }}>
      <span
        className="material-symbols-outlined"
        style={{color: '#d7d7d7', marginRight: '8px'}}>
        search
      </span>
      <Text style={{color: '#7f7f7f', fontWeight: '400'}}>No Data Found</Text>
    </div>
  );
};

export default NoDataFound;
