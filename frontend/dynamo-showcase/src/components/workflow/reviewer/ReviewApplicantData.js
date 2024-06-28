import {Grid} from '@mui/material';
import {Text} from 'glide-design-system';
import React from 'react';
import BackendService from '../../../service/BackendService';

const ReviewApplicantData = ({data}) => {
  const downloadFile = data => {
    BackendService.downloadFile({file: data})
      .then(res => {
        // const blob = new Blob([res.data.documentByteArray], {
        //   type: 'image/png',
        // });

        // // Create a URL for the Blob
        // const url = URL.createObjectURL(blob);

        // // Open the URL in a new tab
        // window.open(url, '_blank');

        const binaryString = window.atob(res?.data?.documentByteArray); // Comment this if not using base64
        const bytes = new Uint8Array(binaryString.length);
        const arrayBuffer = bytes.map((byte, i) => binaryString.charCodeAt(i));
        // eslint-disable-next-line no-undef
        const blob = new Blob([arrayBuffer], {
          type:
            res.data.documentName.split('.').pop() === 'png'
              ? 'image/png'
              : res.data.documentName.split('.').pop() === 'pdf'
              ? 'application/pdf'
              : 'plain/text',
          // type: 'res.data.documentName.split('.').pop()',
        });
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL);
        // loaderOpen(false);
        // Trigger a click event on the link to initiate the download
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <Grid
      container
      padding={2}
      rowSpacing={2}
      style={{
        width: '100%',
        border: '1px solid #d7d7d7',
        borderRadius: '5px',
      }}>
      {Object?.keys(data?.application?.entityProperties).map(property => (
        <Grid
          item
          xs={12}
          md={4}
          gap={1}
          onClick={() => {
            if (property?.includes('consent')) {
              downloadFile(data?.application?.entityProperties[property]);
            }
          }}>
          <Text style={{textTransform: 'capitalize', fontSize: '13px'}}>
            {property}
          </Text>
          <Text
            style={{
              textTransform: 'capitalize',
              fontSize: '16px',
              color: property?.includes('consent') ? '#4c92c6' : '',
              cursor: property?.includes('consent') ? 'pointer' : '',
            }}>
            {property?.includes('consent')
              ? data?.application?.entityProperties[property].replace(
                  /^.*[\\\/]/,
                  '',
                )
              : data?.application?.entityProperties[property]}
          </Text>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReviewApplicantData;
