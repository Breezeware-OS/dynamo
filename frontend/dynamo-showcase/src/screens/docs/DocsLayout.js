import React, {useState} from 'react';
import {Outlet} from 'react-router';
import {makeStyles} from '@material-ui/core';
import DocsNavBar from '../../components/docsNav/DocsNavBar';
import MobileDrawer from '../../components/docsNav/MobileDrawer';
import Footer from '../../components/footer/Footer';

const DocsLayout = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
      }}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          boxSizing: 'border-box',
          paddingTop: '45px',
        }}>
        <div onClick={() => setOpen(true)} className={classes.navContainer}>
          <span style={{color: '#fff'}} className="material-symbols-outlined">
            chevron_right
          </span>
        </div>
        <MobileDrawer
          openMobileDrawer={open}
          handleCloseMobileDrawer={() => setOpen(false)}
        />
        <DocsNavBar />
        <Outlet />
      </div>
      <div> {window.location.pathname !== '/release-notes' && <Footer />}</div>
    </div>
  );
};

export default DocsLayout;

const useStyles = makeStyles(theme => ({
  navContainer: {
    height: '38px',
    width: '34px',
    display: 'none',
    position: 'fixed',
    top: '45px',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
    [theme.breakpoints.down('1000')]: {
      display: 'flex',
    },
    backgroundColor: '#1b3764',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: '1',
  },
}));
