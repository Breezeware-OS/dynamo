import {Divider, Grid, IconButton} from '@mui/material';
import {Drawer, Text} from 'glide-design-system';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function FormHistoryDrawer({open, onClose, versionData}) {
  return (
    <Drawer
      paperStyle={{left: 0}}
      onClose={onClose}
      open={open}
      position="right"
      style={{
        borderRadius: '5px',
        boxShadow: '0px 0px 5px 0px #a5a5a5',
      }}>
      <Grid container marginTop={1} spacing={1} padding={1}>
        <Grid item xs={12} display="flex" justifyContent="space-between">
          <Text style={{color: 'black', fontWeight: '700', fontSize: '18px'}}>
            History
          </Text>
          <IconButton
            sx={{':hover': {backgroundColor: 'transparent'}}}
            onClick={onClose}>
            <CloseIcon sx={{fontSize: '18px'}} />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item container spacing={2}>
          {versionData?.content?.map((version, index) => {
            return (
              <Grid item xs={12} container>
                <Grid item xs={1}>
                  <span
                    class="material-symbols-outlined"
                    style={{marginRight: '6px'}}>
                    publish
                  </span>{' '}
                </Grid>
                <Grid item xs={10} paddingLeft={1}>
                  <Text
                    type="h3"
                    style={{
                      marginBottom: '8px',
                      color: 'black',
                      alignItems: 'center',
                      display: 'flex',
                    }}>
                    Form updated to version {version?.version}
                  </Text>
                  <Text type="h3" style={{color: '#a5a5a5'}}>
                    {new Date(version?.modifiedOn).toLocaleDateString()}
                  </Text>
                </Grid>
                {index + 1 !== versionData?.content?.length && (
                  <Divider sx={{marginTop: '10px'}} />
                )}
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Drawer>
  );
}
