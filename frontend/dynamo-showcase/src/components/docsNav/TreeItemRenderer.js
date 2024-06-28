import React from 'react';
import {TreeItem} from '@mui/x-tree-view/TreeItem';

const TreeItemRenderer = ({data, index, handleOpenMenu, handleSelect}) => {
  return (
    <WrappedComponent
      data={data}
      index={index}
      openMenu={(e, data) => handleOpenMenu(e, data)}
      handleSelect={handleSelect}
    />
  );
};

const WrappedComponent = ({data, index, openMenu, handleSelect}) => {
  return (
    <TreeItem
      key={data?.uniqueId}
      itemId={`${data?.uniqueId}`}
      sx={{
        '.MuiTreeItem-content': {
          gap: '0px',
          padding: '4px',
        },
      }}
      onClick={() => handleSelect(data)}
      label={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <span
            style={{
              whiteSpace: 'nowrap',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
            {data?.title ? data?.title : 'Untitled'}
          </span>
          <span
            className="material-symbols-outlined"
            style={{height: 'fit-content'}}
            onClick={e => {
              e.stopPropagation();
              openMenu(e, data);
            }}>
            more_horiz
          </span>
        </div>
      }>
      {data?.children?.map((data, i) => {
        return (
          <WrappedComponent
            data={data}
            index={i}
            openMenu={openMenu}
            handleSelect={handleSelect}
          />
        );
      })}
    </TreeItem>
  );
};

export default TreeItemRenderer;
