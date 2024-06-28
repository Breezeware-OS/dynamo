import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core';
import {Button, Text} from 'glide-design-system';
import icon from '../../assets/icon/add_data.png';
import CreateModelModal from './CreateModelModal';

const NewUserModel = ({updateHandler}) => {
  const classes = useStyles();

  const [openModal, setOpenModal] = useState(false);
  return (
    <div style={{width: '100%'}}>
      <CreateModelModal
        open={openModal}
        cancelHandler={() => setOpenModal(false)}
        updateHandler={updateHandler}
      />
      <div style={{display: 'flex'}}>
        <Text className={classes.header}>Models</Text>
      </div>
      <div className={classes.container}>
        <Text
          style={{
            fontSize: '16px',
            color: '#949494',
            fontFamily: '"Roboto", sans-serif',
          }}>
          You haven't yet created the model. Please proceed with creating it.{' '}
        </Text>
        <div>
          <img style={{width: '135px', height: '135px'}} src={icon} />
        </div>
        <Button
          type="submit"
          icon={<span className="material-symbols-outlined">add</span>}
          id="submit-btn"
          color="primary"
          className={classes.submitBtn}
          onClick={() => setOpenModal(true)}>
          New Model
        </Button>
      </div>
    </div>
  );
};

export default NewUserModel;

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
  container: {
    display: 'flex !important',
    alignItems: 'center !important',
    width: '100% !important',
    marginTop: '18px !important',
    flexDirection: 'column !important',
    gap: '28px !important',
  },
  header: {
    color: 'rgba(0, 0, 0, 0.99) !important',
    fontSize: '28px !important',
    fontWeight: '500 !important',
    fontFamily: '"Roboto Bold", "Roboto", sans-serif !important',
  },
}));
