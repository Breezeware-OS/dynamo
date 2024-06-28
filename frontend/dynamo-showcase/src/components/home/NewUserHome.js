import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core';
import {Button, Text} from 'glide-design-system';
import icon from '../../assets/icon/add data_icon.svg';
import CreateCollectionModal from '../docsNav/CreateCollectionModal';

const NewUserHome = () => {
  const classes = useStyles();

  const [openModal, setOpenModal] = useState(false);

  return (
    <div style={{width: '100%'}}>
      <CreateCollectionModal
        open={openModal}
        cancelHandler={() => setOpenModal(false)}
      />
      {/* <Text
        style={{
          color: 'rgba(0, 0, 0, 0.99)',
          fontSize: '36px',
          fontWeight: '500',
        }}>
        Home
      </Text> */}
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
          The organization does not have any documents to present.{' '}
        </Text>
        <div>
          <img style={{width: '135px', height: '135px'}} src={icon} />
        </div>
        {/* <Button
          type="submit"
          icon={<span className="material-symbols-outlined">add</span>}
          id="submit-btn"
          color="primary"
          className={classes.submitBtn}
          onClick={() => setOpenModal(true)}>
          New Collection
        </Button> */}
      </div>
    </div>
  );
};

export default NewUserHome;

const useStyles = makeStyles(theme => ({
  submitBtn: {
    fontSize: '14px !important',
    textTransform: 'none !important',
    fontFamily: 'Roboto, sans-serif !important',
    padding: '5px 10px !important',
    backgroundColor: 'rgb(27, 55, 100) !important',
    '&:hover': {
      backgroundColor: 'rgb(27, 55, 100) !important',
    },
  },
}));
