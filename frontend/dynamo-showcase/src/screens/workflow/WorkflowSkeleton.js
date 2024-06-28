import {Grid} from '@mui/material';
import {Skeleton} from 'glide-design-system';
import React from 'react';

const WorkflowSkeleton = () => {
  return (
    <Grid spacing={1} padding={2} sx={{width: '100%'}}>
      <Grid container padding={2} rowSpacing={5} xs={12}>
        <Grid
          xs={12}
          item
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between">
          <Grid
            display="flex"
            flexDirection="column"
            gap={1}
            style={{marginTop: '16px'}}>
            <Skeleton width={100} height={16} style={{borderRadius: '5px'}} />
            <Skeleton width={350} height={36} style={{borderRadius: '5px'}} />
          </Grid>
          <Grid
            display="flex"
            flexDirection="column"
            gap={1}
            style={{marginTop: '16px'}}>
            <Skeleton width={100} height={16} style={{borderRadius: '5px'}} />
            <Skeleton width={350} height={36} style={{borderRadius: '5px'}} />
          </Grid>
          <Grid
            display="flex"
            flexDirection="column"
            gap={1}
            style={{marginTop: '16px'}}>
            <Skeleton width={100} height={16} style={{borderRadius: '5px'}} />
            <Skeleton width={350} height={36} style={{borderRadius: '5px'}} />
          </Grid>
        </Grid>
        <Grid
          xs={12}
          item
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
          marginBottom="16px">
          <Grid display="flex" flexDirection="column" gap={1}>
            <Skeleton width={100} height={16} style={{borderRadius: '5px'}} />
            <Skeleton width={350} height={36} style={{borderRadius: '5px'}} />
          </Grid>
        </Grid>

        <Skeleton style={{borderRadius: '5px'}} width="100%" height={100} />
      </Grid>
    </Grid>
  );
};

export default WorkflowSkeleton;
