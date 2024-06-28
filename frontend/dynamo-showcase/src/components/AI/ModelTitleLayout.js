import React, {useEffect, useState} from 'react';
import {IconButton, Tooltip, TextField} from '@mui/material';

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  };
};

/**
 *
 * @returns a contentEditable div used in Tune, Edit, Train AI screens
 */
const ModelTitleLayout = ({title, setTitle}) => {
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState('');

  const onChangeHandler = debounce(e => {
    setTitle(e);
  }, 1000);

  useEffect(() => setUpdatedTitle(title), [title]);

  return (
    <div style={{display: 'flex'}}>
      {isTitleEditing && (
        <>
          <TextField
            variant="standard"
            name="title"
            value={updatedTitle || title}
            onChange={e => setUpdatedTitle(e.target.value)}
            sx={{
              color: '#999999',
              display: 'flex',
              alignItems: 'center',
              marginRight: '6px',
              overflow: 'hidden',
              '.MuiInputBase-input': {
                fontSize: '22px',
                fontWeight: '700',
                padding: '0px',
                overflow: 'hidden',
              },
              '.MuiInput-root::after': {
                borderColor: '#1b3764',
              },
            }}
          />
          <Tooltip title="Save">
            <IconButton
              sx={{
                padding: 0,
                ':hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={() => {
                setIsTitleEditing(false);
                if (updatedTitle !== title) setTitle(updatedTitle);
              }}>
              <span
                style={{color: '#90cb92'}}
                class="material-symbols-outlined">
                check
              </span>
            </IconButton>
          </Tooltip>
          <Tooltip title="Cancel">
            <IconButton
              sx={{
                padding: 0,
                paddingLeft: 1,
                ':hover': {
                  backgroundColor: 'transparent',
                },
              }}
              onClick={() => {
                setUpdatedTitle(title);
                setIsTitleEditing(false);
              }}>
              <span class="material-symbols-outlined">close</span>
            </IconButton>
          </Tooltip>
        </>
      )}
      {!isTitleEditing && (
        <div
          onFocus={() => setIsTitleEditing(true)}
          className="edit-title"
          style={{
            fontSize: '22px',
            fontWeight: '700',
            color: isTitleEditing ? '#333' : '#999999',
            maxWidth: '342px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            marginRight: '6px',
            overflow: 'hidden',
          }}
          id="title"
          name="title"
          contentEditable
          onInput={e => onChangeHandler(e.currentTarget.textContent)}>
          {updatedTitle || title || 'untitled'}
        </div>
      )}
      {!isTitleEditing && (
        <Tooltip title="Edit Title">
          <IconButton
            style={{paddingBlock: '0px'}}
            disableRipple
            onClick={() => setIsTitleEditing(true)}>
            <span
              className="material-symbols-outlined"
              style={{color: '#999999'}}>
              edit
            </span>
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default ModelTitleLayout;
