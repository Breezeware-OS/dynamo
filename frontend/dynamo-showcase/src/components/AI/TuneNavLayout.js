import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core';
import {Drawer} from 'glide-design-system';
import {useParams, useNavigate} from 'react-router-dom';

const TuneNavLayout = () => {
  const classes = useStyles();
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);
  const {id} = useParams();
  const navigate = useNavigate();
  return (
    <>
      <div
        onClick={() => setOpenMobileDrawer(true)}
        className={classes.mobileViewIcon}>
        <span style={{color: '#fff'}} className="material-symbols-outlined">
          chevron_right
        </span>
      </div>
      <Drawer
        position="left"
        style={{backgroundColor: '#fff'}}
        onClose={() => setOpenMobileDrawer(false)}
        open={openMobileDrawer}>
        <div
          onClick={() => setOpenMobileDrawer(false)}
          className={classes.closeBtn}>
          <span style={{color: '#fff'}} className="material-symbols-outlined">
            chevron_left
          </span>
        </div>
        <div style={{padding: '25px'}}>
          <div
            className={classes.nav}
            onClick={() => navigate(`/AI/tune/${id}/upload-document`)}
            style={{
              backgroundColor: window.location.pathname?.includes(
                'upload-document',
              )
                ? '#f0f6fb'
                : '#fff',
            }}>
            <span
              style={{fontSize: '22px', paddingLeft: '16px'}}
              className="material-symbols-outlined">
              folder_open
            </span>
            <div>Documents</div>
          </div>
          <div
            className={classes.nav}
            onClick={() => navigate(`/AI/tune/${id}/configure-test`)}
            style={{
              marginTop: '8px',
              backgroundColor: window.location.pathname?.includes(
                'configure-test',
              )
                ? '#f0f6fb'
                : '#fff',
            }}>
            <span
              style={{fontSize: '22px', paddingLeft: '16px'}}
              className="material-symbols-outlined">
              build
            </span>
            <div>Configure & Test</div>
          </div>
        </div>
      </Drawer>
      <div className={`${classes.navContainer} ${classes.navBar}`}>
        <div
          className={classes.nav}
          onClick={() => navigate(`/AI/tune/${id}/upload-document`)}
          style={{
            backgroundColor: window.location.pathname?.includes(
              'upload-document',
            )
              ? '#f0f6fb'
              : '#fff',
          }}>
          <span
            style={{fontSize: '22px', paddingLeft: '16px'}}
            className="material-symbols-outlined">
            folder_open
          </span>
          <div>Documents</div>
        </div>
        <div
          className={classes.nav}
          onClick={() => navigate(`/AI/tune/${id}/configure-test`)}
          style={{
            marginTop: '8px',
            backgroundColor: window.location.pathname?.includes(
              'configure-test',
            )
              ? '#f0f6fb'
              : '#fff',
          }}>
          <span
            style={{fontSize: '22px', paddingLeft: '16px'}}
            className="material-symbols-outlined">
            build
          </span>
          <div>Configure & Test</div>
        </div>
      </div>
    </>
  );
};

export default TuneNavLayout;

const useStyles = makeStyles(theme => ({
  navContainer: {
    // minHeight: 'calc(100vh - 130px)',
    minWidth: '260px',
    boxSizing: 'border-box',
    boxShadow: '0px 0px 5px 0px rgba(0, 0, 0, 0.35)',
    backgroundColor: '#fff',
    margin: '24px',
    borderRadius: '5px',
    padding: '12px',
    marginBottom: '18px',
  },
  nav: {
    width: '100%',
    height: '40px',
    borderRadius: '5px',
    color: '#1b3764',
    display: 'flex',
    gap: '6px',
    fontSize: '18px',
    fontFamily: '"Roboto", sans-serif',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f0f6fb !important',
    },
  },
  mobileViewIcon: {
    height: '38px',
    width: '34px',
    display: 'none',
    position: 'fixed',
    top: '45px',
    borderTopRightRadius: '5px',
    borderBottomRightRadius: '5px',
    [theme.breakpoints.down('900')]: {
      display: 'flex',
    },
    backgroundColor: '#1b3764',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: '1',
  },
  navBar: {
    [theme.breakpoints.down('900')]: {
      display: 'none',
    },
  },
  closeBtn: {
    height: '38px',
    width: '34px',
    borderTopLeftRadius: '5px',
    borderBottomLeftRadius: '5px',
    backgroundColor: '#1b3764',
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    marginLeft: 'auto',
  },
}));
