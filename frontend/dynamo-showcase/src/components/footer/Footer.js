import React from 'react';
import {Grid, Divider} from '@mui/material';
import {Text} from 'glide-design-system';

export default function Footer() {
  return (
    <div className="footer">
      <Grid container padding={0}>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="end" padding={1}>
          <Text style={{color: '#aaaaaa'}}>Copyright - Breezeware LLC</Text>
          <Text
            className="footer-release-notes"
            onClick={() => window.open('/release-notes')}
            style={{marginLeft: '8px', color: '#aaaaaa', cursor: 'pointer'}}>
            --v2.7.0--Release Notes--
          </Text>
        </Grid>
      </Grid>
    </div>
  );
}
