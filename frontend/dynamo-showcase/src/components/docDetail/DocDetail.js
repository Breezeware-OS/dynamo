import React from 'react';
import {makeStyles} from '@material-ui/core';
import {Text} from 'glide-design-system';

const DocDetail = ({data, handleOpenMenu, docClickHandler}) => {
  const classes = useStyles();

  const publisedOn = () => {
    const publishedDate = new Date(
      data?.status === 'published'
        ? data?.publishedOn
        : data?.status === 'drafted'
        ? data?.createdOn
        : data?.status === 'deleted'
        ? data?.deletedOn
        : data?.archivedOn,
    );
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - publishedDate.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (hoursDifference >= 1) {
      if (hoursDifference >= 24) {
        const daysDifference = Math.floor(hoursDifference / 24);
        return `${daysDifference} day${daysDifference === 1 ? '' : 's'}`;
      }
      return `${hoursDifference} hour${hoursDifference === 1 ? '' : 's'}`;
    }
    return `${minutesDifference} minute${minutesDifference === 1 ? '' : 's'}`;
  };
  return (
    <div key={data?.id} className={classes.container}>
      <div className={classes.contentDetail}>
        <div onClick={() => docClickHandler(data)}>
          <Text className={classes.text}>
            {data?.title ? data?.title : 'Untitled'}
          </Text>
        </div>
        <span
          className="material-symbols-outlined"
          style={{height: 'fit-content', cursor: 'pointer', fontSize: '36px'}}
          onClick={e => {
            e.stopPropagation();
            handleOpenMenu(e, data);
          }}>
          more_horiz
        </span>
      </div>
      <div className={classes.contentHistory}>
        <div style={{display: 'flex', gap: '4px', paddingRight: '48px'}}>
          <span className="material-symbols-outlined">schedule</span>
          <Text className={classes.textHistory}>
            You{' '}
            {data?.status === 'published'
              ? 'published'
              : data?.status === 'drafted'
              ? 'created'
              : data?.status === 'deleted'
              ? 'deleted'
              : 'archived'}{' '}
            {publisedOn()} ago
          </Text>
        </div>
        {/* <div style={{display: 'flex', gap: '4px'}}>
          <span className="material-symbols-outlined">visibility</span>
          <Text className={classes.textHistory}>Viewed 2 hours ago</Text>
        </div> */}
      </div>
    </div>
  );
};

export default DocDetail;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contentDetail: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  text: {
    color: '#4f4f4f',
    fontSize: '20px !important',
    cursor: 'pointer',
    fontWeight: '500 !important',
  },
  contentHistory: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: '4px',
  },
  textHistory: {
    fontSize: '16px !important',
  },
}));
