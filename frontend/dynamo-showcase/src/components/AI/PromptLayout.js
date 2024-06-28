import React from 'react';
import {makeStyles} from '@material-ui/core';

const PromptLayout = ({promptValue, setPromptValue}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <textarea
        onChange={e => setPromptValue(e.target.value)}
        placeholder={'Enter Prompt'}
        className={classes.searchField}
        value={promptValue}>
        {promptValue}
      </textarea>
    </div>
  );
};

export default PromptLayout;

const useStyles = makeStyles(theme => ({
  container: {
    width: '100% !important',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35) !important',
    borderRadius: '5px',
    flex: '1',
    minHeight: '200px',
    overflowY: 'auto',
  },
  searchField: {
    color: 'grey !important',
    width: '100% !important',
    maxWidth: '100% !important',
    height: '97% !important',
    border: 'none !important',
    minHeight: '97%',
    maxHeight: '97%',
    minWidth: '100%',
    resize: 'none',
    fontSize: '16px',
    padding: '16px',
    '&:focus-visible': {
      outlineStyle: 'none',
    },
    borderRadius: '5px',
  },
}));
