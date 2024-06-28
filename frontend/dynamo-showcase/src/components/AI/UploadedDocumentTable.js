import React from 'react'
import { Table } from 'glide-design-system';
import {makeStyles} from '@material-ui/core';
import TablePagination from '../pagination/TablePagination'

const UploadedDocumentTable = ({data,sortHandler,sortItem,sortOrder,loading,PagehandleChange,pageNo,columns}) => {
    const classes = useStyles();

  return (
    <>
    <div
    style={{
      border: '1px solid #d7d7d7',
      borderRadius: '5px',
      boxShadow: '0px 0px 5px 0px #a5a5a5',
    }}>
    <Table
    columns={columns}
    data={data?.content || []}
    sortHandler={sortHandler}
    sortItem={sortItem}
    sortOrder={sortOrder}
    loading={loading}
    progressCircleStyle={{color: '#0a5b99'}}
    message={(!data || data?.content?.length <= 0) && 'No Files to Show'}
    style={{
      border: '0px',
      minWidth: '1000px',
    }}
    tableContainerStyle={{
      borderBottom: '1px solid #d7d7d7',
      borderRadius: '5px',
    }}
    tableHeaderStyle={{height: '40px', backgroundColor: '#E6EBF2'}}
    tableRowStyles={{height: '40px'}}
  />
  </div>
    <TablePagination
    PagehandleChange={PagehandleChange}
    currentPage={data?.number + 1}
    data={data}
    pageNo={pageNo}
   />
  </>
  )
}

export default UploadedDocumentTable;

const useStyles = makeStyles(theme => ({
    header: {
      color: 'rgba(0, 0, 0, 0.99) !important',
      fontSize: '28px !important',
      fontWeight: '500 !important',
      fontFamily: '"Roboto Bold", "Roboto", sans-serif !important',
    },
  }));