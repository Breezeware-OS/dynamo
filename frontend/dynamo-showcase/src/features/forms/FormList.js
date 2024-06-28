import React, {useEffect, useState} from 'react';
import {LinearProgress, useMediaQuery, useTheme} from '@mui/material';
import ReactGA from 'react-ga4';

import {makeStyles} from '@material-ui/core';
import 'rsuite/dist/rsuite-no-reset.min.css';
import {Button, Chip, Tab, Text, Snackbar} from 'glide-design-system';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import BackendService from '../../service/BackendService';
import FormTable from './FormTable';
import CreateFormModal from './CreateFormModal';

const FormList = ({user}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(null);
  const [error, setError] = useState(null);
  const [loader, setLoader] = useState(false);
  const [index, setIndex] = useState(0);
  const [countData, setCountData] = useState(null);

  const [progress, setProgress] = useState(0);

  const [openCreateFormModal, setOpenCreateFormModal] = useState(false);

  const open = Boolean(showMenu);

  // closes action menu
  const closeMenu = () => {
    setShowMenu(null);
  };

  /**
   * retrieve list of forms
   */
  const retrieveFormCount = () => {
    ReactGA.event({
      category: 'Forms',
      action: 'api call',
    });

    BackendService.retrieveListOfFormCount()
      .then(res => {
        setLoader(false);
        // setError(false);
        setCountData(res?.data);
      })
      .catch(err => {
        setLoader(false);
        setError(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    setLoader(true);
    retrieveFormCount();
  }, []);

  const onTabChange = idx => {
    setIndex(idx);
  };

  return (
    <div style={{paddingLeft: '24px'}}>
      {/* <Snackbar
        sx={{width: '250px'}}
        id="snackbar"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={error}>
        <Alert
          id="alert"
          severity={'error'}
          sx={{
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <div style={{flex: 1, width: '100%'}}>{error}</div>
        </Alert>
      </Snackbar> */}
      {error && (
        <Snackbar
          open={error}
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      <CreateFormModal
        open={openCreateFormModal}
        closeModal={() => setOpenCreateFormModal(false)}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          // paddingTop: 5,
          paddingBottom: 16,
        }}>
        <Text
          style={{fontSize: '24px', color: '#333333', fontWeight: '700'}}
          id="header">
          Forms
        </Text>
        <Button
          className={classes.button}
          id="create-btn"
          icon={
            <span
              className="material-symbols-outlined"
              style={{fontSize: '22px'}}>
              add
            </span>
          }
          style={{
            fontSize: '16px',
            backgroundColor: '#1B3764',
          }}
          onClick={() => {
            setOpenCreateFormModal(true);
            // navigate('/create-form');
            // window.location.reload();
          }}>
          Create Form
        </Button>
      </div>
      {/* <Tab
        onTabChange={onTabChange}
        containerClass={classes.tabStyle}
        activeIndex={index}
        id="tab">
        <div id="all" label={`All (${countData?.all || 0}) `} />
        <div id="draft" label={`Draft (${countData?.draft || 0})`} />
        <div
          id="published"
          label={`Published (${countData?.published || 0})`}
        />
        <div id="archived" label={`Archived (${countData?.archived || 0})`} />
      </Tab> */}
      <FormTable
        activeIndex={index}
        retrieveFormCount={retrieveFormCount}
        user={user}
      />
    </div>
  );
};

export default FormList;

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid #DDD',
    borderRadius: '5px',
    borderBottom: 'none',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
    padding: '25px',
  },
  select: {
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #999999',
    backgroundColor: 'transparent',
    color: 'black',
  },
  durationField: {
    color: 'black !important',
    '& .rs-picker-toggle-wrapper': {
      display: 'inline-block',
      maxWidth: '100%',
      verticalAlign: 'middle',
    },
    '& .rs-picker-menu': {
      zIndex: 20000,
    },
    '& .rs-picker-toggle-value': {
      color: 'black !important',
    },
  },
  menuItem: {
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'flex-start',
    padding: '14px !important',
    height: '45px !important',
    alignItems: 'center',
    color: '#333333 !important',
  },

  tabStyle: {
    borderBottom: 'none !important',
  },
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
}));
