import React, {useState, useEffect} from 'react';
import {
  Button,
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Text,
  Snackbar,
} from 'glide-design-system';
import {makeStyles} from '@material-ui/core';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import {Alert, Divider, IconButton} from '@mui/material';
import BackendService from '../../service/BackendService';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

export default function InviteUserModal({
  formId,
  open,
  closeModal,
  retrieveData,
}) {
  const classes = useStyles();
  const [emailList, setEmailList] = useState([]);

  const [userEmail, setUserEmail] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notification, setNotification] = useState(false);
  const [severity, setSeverity] = useState(null);

  const handleChange = event => {
    const {
      target: {value},
    } = event;
    setUserEmail(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const submitHandler = () => {
    const postData = {
      emailList: userEmail,
      formUniqueId: formId,
    };
    BackendService.inviteFormUser(postData)
      .then(() => {
        setNotification(true);
        setSeverity('success');
        setNotificationMessage('User Invited Successfully!');
        closeModal();
        retrieveData();
        setUserEmail([]);
      })
      .catch(err => {
        setNotification(true);
        setSeverity('error');
        setNotificationMessage(err?.message);
      });
  };

  useEffect(() => {
    BackendService.getEmailList()
      .then(res => {
        setEmailList(res?.data);
      })
      .catch(err => {
        setNotification(true);
        setSeverity('error');
        setNotificationMessage('Error fetching users.');
      });
  }, []);

  return (
    <>
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
      <Modal
        style={{width: '500px'}}
        open={open}
        onClose={closeModal}
        id="modal">
        <ModalTitle
          style={{
            padding: '10px 24px',
            backgroundColor: 'white',
            display: 'block',
          }}
          id="modal-title">
          <div
            style={{
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              // borderBottom: '1px solid #d7d7d7',
            }}>
            <Text type="h2">Invite</Text>
            <IconButton
              onClick={closeModal}
              size="small"
              style={{padding: 0}}
              id="close-icon">
              <CloseIcon />
            </IconButton>
          </div>
          <div style={{paddingTop: '6px'}}>
            <Divider />
          </div>
        </ModalTitle>
        <ModalContent style={{padding: '16px 24px'}}>
          <div>
            <Text className="modal-info">
              Entered individuals will receive an email containing a link to
              accessing the form.
            </Text>
          </div>
          <FormControl sx={{width: '96%'}}>
            <InputLabel id="demo-multiple-chip-label">Email</InputLabel>
            <Select
              sx={{width: '100%'}}
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={userEmail}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={selected => (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                  {selected.map(value => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}>
              {emailList.map(email => (
                <MenuItem key={email} value={email} style={{fontWeight: 400}}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ModalContent>
        <ModalActions style={{padding: '24px', paddingTop: '0px'}}>
          <Button
            className={classes.canelButton}
            // icon={<span className="material-symbols-outlined">close</span>}
            // iconPosition="start"
            color="secondary"
            variant="outlined"
            onClick={closeModal}
            id="cancel-btn"
            style={{marginRight: '15px', fontSize: '16px'}}>
            Cancel
          </Button>
          <Button
            className={classes.button}
            onClick={submitHandler}
            // className={classes.button}
            color="primary"
            // icon={
            //   <span
            //     style={{color: 'white', marginRight: '8px'}}
            //     className="material-symbols-outlined">
            //     send
            //   </span>
            // }
            // iconPosition="start"

            id="submit-btn">
            Send
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
}

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
  canelButton: {
    minWidth: 'auto',
  },
}));
