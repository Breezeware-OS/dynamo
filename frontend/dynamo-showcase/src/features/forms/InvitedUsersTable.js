import {Alert, Grid, IconButton, Divider} from '@mui/material';
import {makeStyles} from '@material-ui/core';
import {
  Avatar,
  Button,
  Chip,
  Text,
  TextField,
  Snackbar,
} from 'glide-design-system';
import React, {useEffect, useState} from 'react';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import BackendService from '../../service/BackendService';
import InviteUserModal from './InviteUserModal';
import DeleteUserInviteModal from './DeleteUserInviteModal';
import formNotPublished from '../../assets/icon/form_not_published.png';

const BASE_DYNAMO_FORM_URL = process.env.REACT_APP_DYNAMO_FORM_URL + '/form';

export default function InvitedUsersTable({formId, data}) {
  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [tableData, setData] = useState([]);
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortItem, setSortItem] = useState('createdOn');
  const [pageNo, setPageNo] = useState(0);
  const [error, setError] = useState(null);

  const [isCopied, setIsCopied] = useState(false);
  const [copiedValue, setCopiedValue] = useState(null);

  const [currentUserInviteData, setCurrentUserInvitedata] = useState(null);

  const [openDeleteUserInviteModal, setOpenDeleteUserInviteModal] =
    useState(false);
  const [openInviteUserModal, setOpenInviteUserModal] = useState(false);
  const [currentInviteData, setCurrentInviteData] = useState(null);

  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [severity, setSeverity] = useState(null);

  /**
   * retrieve list of forms
   */
  const retrieveData = () => {
    BackendService.retrieveListUsersInvited({
      search,
      pageNo,
      sortItem,
      sortOrder,
      date,
      id: formId,
    })
      .then(async res => {
        // await loginfo('Form List Success', res);
        setLoader(false);
        setData(res.data);
        setError(false);
      })
      .catch(async err => {
        // await logError('Form List Error', err);
        setLoader(false);
        setError(err?.response?.data?.message);
      });
  };

  const copyFormUrl = (url, id) => {
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();

    document.execCommand('copy');
    document.body.removeChild(input);
    setCopiedValue(url);
    setIsCopied(true);
    setNotificationMessage('Copied!');
    setNotification(true);
    setSeverity('success');
    // setTimeout(() => {
    //   setIsCopied(false);
    //   setCopiedValue(null);
    // }, 1500);
  };

  /**
   * Search data on value change
   * @param {*} data input value
   */
  const searchHandler = data => {
    setSearch(data?.target?.value);
  };

  useEffect(() => {
    retrieveData();
  }, [search, sortItem, sortOrder, date, pageNo]);

  return (
    <Grid container spacing={1} padding="16px" paddingTop="0px" height="80vh">
      {/* <Snackbar
        autoHideDuration={3000}
        id="snackbar"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={notification}
        onClose={() => setNotification(false)}>
        <Alert
          id="alert"
          severity={severity}
          onClose={() => setNotification(false)}>
          {notificationMessage}
        </Alert>
      </Snackbar> */}
      {notification && (
        <Snackbar
          open={notification}
          message={notificationMessage}
          type={severity}
          onClose={() => setNotification(false)}
        />
      )}

      <InviteUserModal
        formId={data?.uniqueId}
        open={openInviteUserModal}
        closeModal={() => setOpenInviteUserModal(false)}
        retrieveData={retrieveData}
      />
      <DeleteUserInviteModal
        open={openDeleteUserInviteModal}
        getData={retrieveData}
        closeModal={() => setOpenDeleteUserInviteModal(false)}
        currentUserInviteData={currentUserInviteData}
      />
      {data?.version && (
        <Grid item xs={2}>
          <div
            style={{
              // width: '90%',
              borderRadius: 8,
              padding: '3.5%',
              border: '1px solid #d7d7d7',
              boxShadow: '0px 0px 5px 0px #a5a5a5',
              // height: '50px',
              // display: 'flex',
              // flexDirection: 'row',
              // alignItems: 'center',
              height: '100%',
            }}>
            <Text
              style={{
                alignItems: 'center',
                display: 'flex',
                color: 'rgb(45, 71, 112)',
                backgroundColor: '#F0F6FB',
                padding: '2%',
                borderRadius: '5px',
              }}>
              <span className="material-symbols-outlined">publish</span>Publish
              Settings
            </Text>
          </div>
        </Grid>
      )}
      {data?.version && (
        <Grid
          item
          xs={10}
          container
          justifyContent="center"
          sx={{height: data?.accessType === 'public' ? '10%' : '45%'}}>
          <Grid item xs={10} container spacing={1}>
            <Grid item xs={12}>
              <Text type="h2" style={{display: 'flex', alignItems: 'center'}}>
                Form Link
                {data?.accessType && (
                  <Chip
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '5px',
                      fontSize: '12px',
                      fontWeight: 400,
                      textTransform: 'capitalize',
                      backgroundColor: '#d7d7d7',
                      color: '#333333',
                      marginRight: '8px',
                      marginLeft: '8px',
                    }}>
                    {data?.accessType === 'public' && (
                      <span
                        style={{fontSize: '16px', marginRight: '4px'}}
                        class="material-symbols-outlined">
                        public
                      </span>
                    )}
                    {data?.accessType === 'private' && (
                      <span
                        style={{fontSize: '16px', marginRight: '4px'}}
                        class="material-symbols-outlined">
                        lock
                      </span>
                    )}
                    {data?.accessType === 'private'
                      ? 'Private'
                      : data?.accessType === 'public'
                      ? 'Public'
                      : ''}
                  </Chip>
                )}
              </Text>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="space-between">
              <Text
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}>
                <span
                  class="material-symbols-outlined"
                  style={{marginRight: '5px', color: '#1B3764'}}>
                  attachment
                </span>
                {data?.uniqueId && data?.status === 'Published' && (
                  <a
                    style={{
                      cursor: 'pointer',
                    }}>{`${BASE_DYNAMO_FORM_URL}/${data.uniqueId}`}</a>
                )}
              </Text>

              {data?.uniqueId && data?.status === 'Published' && !isCopied && (
                <span
                  onClick={() =>
                    copyFormUrl(`${BASE_DYNAMO_FORM_URL}/${data.uniqueId}`)
                  }
                  style={{
                    cursor: 'pointer',
                    fontSize: '17px',
                    marginLeft: '5px',
                    color: 'black',
                  }}
                  class="material-symbols-outlined">
                  content_copy
                </span>
              )}
              {isCopied && (
                <span
                  style={{marginLeft: '5px', color: 'green'}}
                  class="material-symbols-outlined">
                  check
                </span>
              )}
            </Grid>

            {data?.accessType === 'private' && (
              <Grid item xs={12} lg={7} container spacing={2}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent="space-between">
                  <Text type="h2">Shared People</Text>
                  <Button
                    className={classes.button}
                    variant="outlined"
                    onClick={() => setOpenInviteUserModal(true)}>
                    <span className="material-symbols-outlined">add</span> Add
                    People
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={searchHandler}
                    label="User Email"
                    placeholder="Search User Email"
                    value={search}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12} container>
                  {tableData?.content?.length === 0 && !search && (
                    <Grid
                      item
                      xs={12}
                      sx={{
                        // border: '1px solid #d7d7d7',
                        borderRadius: '5px',
                        padding: '8px',
                        textAlign: 'center',
                        marginTop: '3%',
                      }}>
                      <span
                        style={{fontSize: '75px', color: '#999999'}}
                        className="material-symbols-outlined">
                        person_add
                      </span>
                      <Text style={{fontSize: '16px', color: '#949494'}}>
                        You haven't invited any users yet
                      </Text>
                    </Grid>
                  )}
                  {tableData?.content?.length === 0 && search && (
                    <Grid
                      item
                      xs={12}
                      sx={{
                        border: '1px solid #d7d7d7',
                        borderRadius: '5px',
                        padding: '8px',
                        textAlign: 'center',
                      }}>
                      <Text type="h2">No Users Found</Text>
                    </Grid>
                  )}
                  {tableData?.content?.map(data => {
                    return (
                      <Grid
                        item
                        xs={12}
                        container
                        sx={{
                          boxShadow: '0px 0px 5px 0px #a5a5a5',
                          border: '1px solid #d7d7d7',
                          borderRadius: '5px',
                          padding: '10px',
                          alignItems: 'center',
                        }}>
                        <Grid item xs={6} container>
                          <Avatar
                            style={{
                              backgroundColor: 'white',
                              border: '1px solid #d7d7d7',
                              color: 'black',
                              boxShadow: '0px 0px 5px 0px #a5a5a5',
                              marginRight: '10px',
                            }}
                            label={data?.email?.charAt(0).toUpperCase()}
                          />
                          <Text style={{fontSize: '18px'}} type="h3">
                            {data?.email}
                          </Text>
                        </Grid>
                        <Grid item xs={3} display="flex">
                          <Text
                            style={{
                              marginRight: '5px',
                              fontSize: '18px',
                              color: '#a5a5a5',
                            }}>
                            {new Date(data?.createdOn).toLocaleDateString()}
                          </Text>
                          <Text style={{fontSize: '18px', color: '#a5a5a5'}}>
                            {new Date(data?.createdOn).toLocaleTimeString()}
                          </Text>
                        </Grid>
                        <Grid item xs={3} textAlign="end">
                          <IconButton disabled>
                            <MoreHorizIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}

      {!data?.version && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginTop: '18px',
            flexDirection: 'column',
            gap: '28px',
          }}>
          <Text style={{fontSize: '16px', color: '#949494'}}>
            The form has not yet been published
          </Text>
          <img
            src={formNotPublished}
            alt=""
            style={{
              width: '135px',
              height: '135px',
            }}
          />
        </div>
      )}
    </Grid>
  );
}

const useStyles = makeStyles(theme => ({
  button: {
    color: '#1B3764 !important',
    borderColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
  canelButton: {
    minWidth: 'auto',
  },
}));
