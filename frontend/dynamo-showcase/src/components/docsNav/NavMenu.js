import React from 'react';
import {makeStyles} from '@material-ui/core';

const NavMenu = ({page, navMenu, iconName, title, onClick}) => {
  const classes = useStyles();
  return (
    <div
      key={navMenu}
      style={{
        backgroundColor:
          page === navMenu ? 'rgba(240, 246, 251, 0.99)' : 'transparent',
        color: page === navMenu ? '#1b3764' : '#999999',
      }}
      className={classes.content}
      onClick={() => onClick(navMenu)}>
      <span style={{fontSize: '22px'}} className="material-symbols-outlined">
        {iconName}
      </span>{' '}
      {title}
    </div>
  );
};

export default NavMenu;

const useStyles = makeStyles(theme => ({
  content: {
    width: '100%',
    height: '40px',
    borderRadius: '10px',
    paddingInline: '16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    fontSize: '16px',
    cursor: 'pointer',
  },
}));
