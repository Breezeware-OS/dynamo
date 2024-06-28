import React, {useState} from 'react';
import {IconButton} from '@mui/material';
import {Modal, ModalContent, ModalTitle, Text} from 'glide-design-system';
import CloseIcon from '@mui/icons-material/Close';

const formatTimestampToDateString = timestamp => {
  const dateObj = new Date(timestamp);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const month = monthNames[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month} ${day} ${year}`;
};

export default function ViewResponseModal({
  open,
  closeModal,
  currentResponseData,
}) {
  return (
    <>
      <Modal open={open} onClose={closeModal} id="modal">
        <ModalTitle id="modal-title">
          <Text type="h2">View Response - {currentResponseData?.id}</Text>
          <IconButton
            onClick={closeModal}
            size="small"
            style={{padding: 0}}
            id="close-icon">
            <CloseIcon />
          </IconButton>
        </ModalTitle>
        <ModalContent
          id="modal-content"
          style={{display: 'flex', justifyContent: 'center', padding: '25px'}}>
          <div>
            <div style={{marginBottom: '8px'}}>
              <Text style={{fontSize: '12px', color: 'rgb(127, 127, 127)'}}>
                Submitted Date
              </Text>
              <Text style={{fontSize: '16px', fontWeight: '400'}}>
                {formatTimestampToDateString(currentResponseData?.createdOn)}
              </Text>
            </div>
            <div>
              <Text style={{fontSize: '12px', color: 'rgb(127, 127, 127)'}}>
                Response
              </Text>
              <Text
                style={{
                  fontSize: '16px',
                  fontWeight: '400',
                }}>
                {JSON.stringify(currentResponseData?.responseJson)}
              </Text>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
