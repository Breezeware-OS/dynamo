import React, {useEffect, useState} from 'react';
import {
  Grid,
  IconButton,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Modal,
  ModalContent,
  ModalTitle,
  TextField,
  Text,
  Divider,
  Snackbar,
} from 'glide-design-system';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import {useNavigate} from 'react-router';
import {makeStyles} from '@material-ui/core';
import BackendService from '../../service/BackendService';

const HistoryDrawer = ({open, handleClose, data}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [historyData, setHistoryData] = useState([]);
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const monthYearHandler = timestamp => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const formateDateHandler = timestamp => {
    const date = new Date(timestamp);

    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
      date,
    );

    const dateParts = formattedDate.split(',');
    const dateWithoutCommas = dateParts.join('');

    return dateWithoutCommas;
  };

  const viewHistoryHandler = hisData => {
    handleClose();
    navigate(`/docs/${hisData?.documentId}/history/${hisData?.uniqueId}`);
  };

  useEffect(() => {
    if (open) {
      let date = searchDate ? new Date(searchDate)?.toISOString() : '';
      BackendService.getHistories(data?.uniqueId, searchValue, date)
        .then(res => {
          const data = res?.data?.reduce((acc, item) => {
            const editedOn = new Date(item?.editedOn)?.toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            });

            // Check if the key exists in the accumulator
            if (acc[editedOn]) {
              const customItem = {
                ...item,
              };
              acc[editedOn].push(customItem);
            } else {
              const customItem = {
                ...item,
              };
              acc[editedOn] = [customItem];
            }

            return acc;
          }, []);
          let updatedData = [];
          Object.entries(data).forEach(([key, value]) =>
            updatedData.push(value),
          );
          setHistoryData(updatedData);
        })
        .catch(err => {
          setNotification(true);
          setNotificationError(true);
          setNotificationMessage('Something Went Wrong.');
        });
    }
  }, [open, searchDate, searchValue]);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setSearchValue('');
        setSearchDate('');
      }}
      id="modal"
      containerStyle={{justifyContent: 'right'}}
      style={{padding: '16px', paddingTop: '8px'}}
      className={classes.modal}>
      {notification && (
        // <Snackbar
        //   id="alert-message"
        //   style={{zIndex: '1'}}
        //   open
        //   message={notificationMessage}
        //   type={notificationError ? 'error' : 'success'}
        //   autoHideDuration={5000}
        //   onClose={() => setNotification(false)}
        // />
        <Snackbar
          open
          message={notificationMessage}
          type={notificationError ? 'error' : 'success'}
          onClose={() => setNotification(false)}
        />
      )}
      <ModalTitle
        style={{
          padding: '0px',
          backgroundColor: '#fff',
          borderBottom: '1px solid #d7d7d7',
        }}>
        <Grid item container xs={12} justifyContent="space-between">
          <Typography className={classes.header}>History</Typography>
          <IconButton
            sx={{padding: 0, float: 'right'}}
            id="cancel-icon"
            onClick={() => {
              handleClose();
              setSearchValue('');
              setSearchDate('');
            }}>
            <span class="material-symbols-outlined">close</span>
          </IconButton>
        </Grid>
      </ModalTitle>
      <ModalContent
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0px',
          paddingTop: '12px',
        }}>
        <Grid
          container
          item
          xs={12}
          display="flex"
          flexWrap="wrap"
          sx={{width: '100%'}}>
          <Grid item xs={8} paddingRight={{md: 1, xs: 0}} sx={{width: '100%'}}>
            <TextField
              width="100%"
              style={{maxWidth: '100%', width: '100%'}}
              placeholder={'Search by User Name'}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              icon={
                <span
                  style={{fontSize: '18px'}}
                  className="material-symbols-outlined">
                  search
                </span>
              }
            />
          </Grid>
          <Grid item xs={4} paddingRight={{md: 0, xs: 0}} sx={{width: '100%'}}>
            <input
              type="date"
              name="birthdate"
              style={{
                width: '100%',
                maxWidth: '100%',
                height: '36px',
                borderRadius: '4px',
                border: '1.5px solid #d7d7d7',
              }}
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            {historyData?.map((hisData, i) => {
              return (
                <Accordion
                  key={historyData?.uniqueId}
                  style={{marginTop: '12px'}}>
                  <AccordionSummary
                    expandIcon={<ArrowDropDownCircleOutlinedIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header">
                    <Text className={classes.text}>
                      {monthYearHandler(hisData?.[0]?.editedOn)}
                    </Text>
                    <Divider
                      style={{
                        borderTop: 'none',
                        borderRight: '1px solid #d7d7d7',
                        height: '25px',
                        margin: '0px',
                        marginInline: '8px',
                        width: '5px',
                      }}
                    />
                    <Text className={classes.text}>
                      {hisData?.length} histories
                    </Text>
                    <Divider
                      style={{
                        width: '110px',
                        marginleft: '8px',
                        marginBlock: 'auto',
                        marginRight: '0px',
                      }}
                    />
                  </AccordionSummary>
                  <AccordionDetails>
                    {hisData?.map((hisDetail, ind) => {
                      return (
                        <div>
                          <div
                            key={hisDetail?.uniqueId}
                            style={{display: 'flex', cursor: 'pointer'}}
                            onClick={() => viewHistoryHandler(hisDetail)}>
                            <div
                              style={{
                                borderRadius: '50px',
                                height: '45px',
                                width: '45px',
                                boxShadow: '0px 0px 5px 0px #a5a5a5',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '16px',
                              }}>
                              {hisDetail?.editedUserFirstName?.charAt(0)}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                paddingLeft: '8px',
                                justifyContent: 'center',
                              }}>
                              <div style={{display: 'flex'}}>
                                <Text className={classes.historyText}>
                                  Version {hisDetail?.version}
                                </Text>
                                <Divider
                                  style={{
                                    borderTop: 'none',
                                    borderRight: '1px solid #d7d7d7',
                                    height: '25px',
                                    margin: '0px',
                                    marginInline: '8px',
                                    width: '5px',
                                  }}
                                />
                                <Text className={classes.historyText}>
                                  {formateDateHandler(hisDetail?.editedOn)}{' '}
                                </Text>
                              </div>
                              <div style={{display: 'flex', gap: '8px'}}>
                                <span
                                  className="material-symbols-outlined"
                                  style={{fontSize: '20px', color: '#999'}}>
                                  {hisDetail?.status === 'published'
                                    ? 'publish'
                                    : hisDetail?.status === 'forked'
                                    ? 'edit'
                                    : hisDetail?.status === 'archived'
                                    ? 'archive'
                                    : 'delete'}
                                </span>
                                <Text style={{color: '#999'}}>
                                  {hisDetail?.editedUserFirstName}{' '}
                                  {hisDetail?.editedUserLastName}{' '}
                                  {hisDetail?.status}
                                </Text>
                              </div>
                            </div>
                          </div>
                          {ind !== hisData?.length - 1 && (
                            <Divider style={{marginBlock: '16px'}} />
                          )}
                        </div>
                      );
                    })}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Grid>
        </Grid>
      </ModalContent>
    </Modal>
  );
};

export default HistoryDrawer;

const useStyles = makeStyles(theme => ({
  header: {
    fontFamily: 'Roboto, sans-serif !important',
    fontWeight: '700 !important',
    fontSize: '18px !important',
    marginBottom: '2px !important',
    color: '#999999 !important',
  },
  subheader: {
    fontFamily: 'Roboto, sans-serif !important',
    fontSize: '14px !important',
    marginBottom: '4px !important',
  },

  textField: {
    width: '100% !important',
    fontFamily: 'Roboto,sans-serif !important',
  },

  breadcrumbs: {
    fontSize: '12px !important',
    color: 'rgb(170, 170, 170) !important',
    fontFamily: 'sans-serif !important',
  },

  error: {
    textAlign: 'left !important',
    color: 'red !important',
    fontSize: '14px !important',
    fontFamily: 'Roboto,sans-serif !important',
    paddingBottom: '5px !important',
  },

  modal: {
    width: '380px !important',
    fontFamily: 'Roboto, sans-serif !important',
    maxHeight: '100vh',
    overflowY: 'auto',
    height: '852px !important',
    maxWidth: '100%',
    [theme.breakpoints.down('380')]: {
      width: '100% !important',
      minWidth: 'auto !important',
      maxHeight: '100vh',
      overflowY: 'auto',
    },
  },

  cancelBtnContainer: {
    paddingLeft: '0px !important',
    [theme.breakpoints.down('md')]: {
      padding: '2px !important',
      paddingTop: '5px !important',
    },
    fontFamily: 'Roboto,sans-serif !important',
    marginRight: '16px !important',
  },

  submitBtnContainer: {
    paddingRight: '0px !important',
    [theme.breakpoints.down('md')]: {
      padding: '2px !important',
      paddingTop: '5px !important',
    },
    fontFamily: 'Roboto,sans-serif !important',
  },

  submitBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
  },
  cancelBtn: {
    fontSize: '14px !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    textAlign: 'center !important',
    textTransform: 'none !important',
  },
  span: {
    color: 'red',
    fontSize: '14px',
    fontFamily: 'sans-serif !important',
  },
  text: {
    fontSize: '14px',
    color: '#999999',
    fontWeight: '500 !important',
    fontFamily: '"Roboto Medium", "Roboto", sans-serif',
  },
  historyText: {
    fontSize: '18px',
    color: '#333',
    fontWeight: '500 !important',
    fontFamily: '"Roboto Medium", "Roboto", sans-serif',
  },
}));
