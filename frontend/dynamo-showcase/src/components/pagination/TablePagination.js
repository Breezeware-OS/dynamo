import {makeStyles} from '@material-ui/core';
import {Pagination} from 'glide-design-system';
import React from 'react';

const TablePagination = ({data, currentPage, PagehandleChange, pageNo}) => {
  const classes = useStyles();

  const startIndex = pageNo === 0 ? 0 : pageNo * 8;
  const endIndex = Math.min(startIndex + data?.numberOfElements - 1, data?.totalElements - 1);

  const formatIndex = index => {
    return (index + 1).toString().padStart(2, '0');
  };

  const paginationOnChange = value => {
    PagehandleChange(value);
  };
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        // padding: '6px',
        marginTop: '16px',
      }}>
      <p className={classes.pageInfo}>
        Showing {data?.totalElements ? formatIndex(startIndex) : 0}-
        {data?.totalElements ? formatIndex(endIndex) : 0} of{' '}
        {data?.totalElements} entries
      </p>
      <Pagination
        count={data?.totalPages}
        page={currentPage}
        onChange={paginationOnChange}
        variant="outlined"
        className={classes.pagination}
      />
    </div>
  );
};

export default TablePagination;

const useStyles = makeStyles(theme => ({
  pageInfo: {
    fontSize: '16px !important',
    color: '#555555 !important',
    fontFamily: 'Roboto,sans-serif',
  },
  pagination: {
    color: '#7f7f7f',
  },
}));
