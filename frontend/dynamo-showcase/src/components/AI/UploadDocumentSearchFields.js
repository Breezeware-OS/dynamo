import React from 'react';
import {Button, TextField} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';

/**
 *
 * @param {*} showDate - Train search by date is not used but it is in Tune Table this will tell whether to show date field or not
 * @returns search fields for train and tune layout
 */
const UploadDocumentSearchFields = ({
  setSearchFile,
  searchFile,
  status,
  setStatus,
  searchDate,
  setSearchDate,
  showDate,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.searchContainer}>
      <TextField
        onChange={e => setSearchFile(e.target.value)}
        icon={<span className="material-symbols-outlined">search</span>}
        placeholder={'Search File Name'}
        value={searchFile}
        containerClass={classes.searchField}
      />
      <select
        id="status"
        style={{color: '#333333', paddingLeft: '9px'}}
        onChange={e => setStatus(e.target.value)}
        value={status}
        className={classes.selectField}
        name="status">
        <option disabled value="" style={{paddingBlock: '4px'}}>
          Status
        </option>
        <option value="uploaded" style={{paddingBlock: '4px'}}>
          Uploaded
        </option>
        <option value="embed" style={{paddingBlock: '4px'}}>
          Embedded
        </option>
      </select>
      {showDate && (
        <input
          type="date"
          name="uploadedOn"
          className={classes.dateField}
          value={searchDate}
          onChange={e => setSearchDate(e.target.value)}
        />
      )}
      {(showDate
        ? searchFile || status || searchDate
        : searchFile || status) && (
        <Button
          id="clear-btn"
          color="primary"
          className={classes.submitBtn}
          onClick={() => {
            setSearchFile('');
            setStatus('');
            if (showDate) setSearchDate('');
          }}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default UploadDocumentSearchFields;

const useStyles = makeStyles(theme => ({
  submitBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    backgroundColor: '#9b9b9b !important',
    color: '#fff !important',
    '&:hover': {
      backgroundColor: '#9b9b9b !important',
      color: '#fff !important',
    },
  },
  searchContainer: {
    marginBlock: '18px !important',
    padding: '24px !important',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    borderRadius: '5px !important',
    display: 'flex !important',
    gap: '24px !important',
    flexWrap: 'wrap !important',
  },
  searchField: {
    color: 'grey !important',
    width: '100% !important',
    maxWidth: '100% !important',
  },
  selectField: {
    width: '342px !important',
    maxWidth: '100% !important',
    marginTop: '0px !important',
    border: '1px solid #d7d7d7 !important',
    backgroundColor: '#ffffff !important',
    borderRadius: '5px !important',
    '&:focus-visible': {
      outlineStyle: 'none !important',
    },
    '&:hover:focus:active': {
      border: '1px solid #d7d7d7 !important',
    },
    height: '36px !important',
    fontSize: '14px !important',
  },
  dateField: {
    width: '342px',
    maxWidth: '100%',
    height: '36px',
    borderRadius: '4px',
    border: '1.5px solid #d7d7d7',
    '&:focus-visible': {
      outlineStyle: 'none !important',
    },
    '&:hover:focus:active': {
      border: '1px solid #d7d7d7 !important',
    },
    paddingInline: '9px',
  },
}));
