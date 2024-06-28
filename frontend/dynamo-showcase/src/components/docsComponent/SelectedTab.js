import {Divider, Text} from 'glide-design-system';
import React from 'react';

const SelectedTab = ({name}) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
      <Divider
        style={{
          borderTopWidth: '2px',
          margin: '0px',
          borderColor: '#1b3764',
          width: '32px',
        }}
      />
      <Text style={{color: '#1b3764', fontSize: '16px', fontWeight: '500'}}>
        {name}
      </Text>
    </div>
  );
};

export default SelectedTab;
