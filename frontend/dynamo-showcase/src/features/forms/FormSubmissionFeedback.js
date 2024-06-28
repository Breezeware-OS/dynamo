import React, {useEffect} from 'react';
import {Grid} from '@mui/material';
import {Text} from 'glide-design-system';
import useDocumentTitle from '../../helpers/useDocumentTitle';
import CheckCircle from '../../assets/icon/checkIcon.png';

export default function FormSubmissionFeedback() {
  useDocumentTitle('Form Submitted');

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <Grid
      container
      spacing={2}
      textAlign={'center'}
      alignItems={'center'}
      marginTop={3}>
      <Grid item xs={12}>
        {/* <span
          style={{fontSize: '300px', color: 'green'}}
          class="material-symbols-outlined">
          check_circle
        </span> */}

        <img src={CheckCircle} alt="" />
      </Grid>
      <Grid item xs={12}>
        <Text type={'h1'} style={{fontSize: '32px'}}>
          Thank You!
        </Text>
      </Grid>
      <Grid item xs={12}>
        <Text type={'h3'}>Your submission has been received.</Text>
      </Grid>
    </Grid>
  );
}
