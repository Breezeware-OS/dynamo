import {Alert, IconButton} from '@mui/material';
import {
  Modal,
  ModalActions,
  ModalContent,
  ModalTitle,
  Table,
  Text,
  TextField,
  Snackbar,
} from 'glide-design-system';
import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import NoDataFound from '../../components/noData/NoDataFound';
import BackendService from '../../service/BackendService';
import {getFormData, handleFormVersionsModal, setFormData} from './formSlice';
import TablePagination from '../../components/pagination/TablePagination';
import {logError, loginfo, traceSpan} from '../../helpers/tracing';

const FormVersionsList = ({open, versionData}) => {
  const formData = useSelector(getFormData);
  const dispatch = useDispatch();
  const [data, setData] = useState(versionData);
  const [error, setError] = useState();
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortItem, setSortItem] = useState('modifiedOn');
  const [pageNo, setPageNo] = useState(0);
  const [search, setSearch] = useState('');
  const [loader, setLoader] = useState(false);

  const tablecolumns = [
    {
      label: 'version',
      fieldName: 'version',
      sort: true,
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        return rowItem?.version ? rowItem?.version : '-';
      },
    },

    {
      label: 'updatedDate',
      fieldName: 'modifiedOn',
      type: 'date',
      sort: true,
      style: {
        textAlign: 'left',
      },
    },
  ];

  const closeModal = () => {
    dispatch(handleFormVersionsModal());
  };

  /**
   * Search data on value change
   * @param {*} data input value
   */
  const searchHandler = data => {
    setSearch(data?.target?.value);
  };

  /**
   * updates sort order and sort item state when sort button is clicked
   * @param {*} order  order to be sorted(ASC,DESC)
   * @param {*} item item to be sorted(created-on)
   */
  const sortHandler = (sortOrder, sortItem) => {
    const updatedSortItem = sortItem?.startsWith('created')
      ? sortItem?.replace(/o/g, 'O')?.split(' ')?.join('')
      : sortItem;
    setSortItem(updatedSortItem);
    setSortOrder(sortOrder);
    // dispatch(availabilitySliceActions.handleSorting());
  };

  /**
   * Pagination of user table
   * @param {*} value page number
   */
  const PagehandleChange = value => {
    setPageNo(value - 1);
    // dispatch(handlePagination(value - 1));
  };

  /**
   * Retieves versions of the selected form
   */
  const retrieveData = () => {
    BackendService.retrieveListOfFormVersions({
      id: formData?.id,
      pageNo,
      search,
      sortItem,
      sortOrder,
    })
      .then(res => {
        // loginfo('Form version List', res);
        setLoader(false);
        setData(res.data);
      })
      .catch(err => {
        // logError('Form version List', err);

        setLoader(false);
        setError(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    setLoader(true);
    // traceSpan('Retrieving form versions', async () => {
    retrieveData();
    // });
  }, [search, sortItem, sortOrder, pageNo, formData]);

  return (
    <>
      {/* <Snackbar
        autoHideDuration={1000}
        id="snackbar"
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={error}>
        <Alert id="alert" severity={'error'}>
          {error}
        </Alert>
      </Snackbar> */}
      {error && (
        <Snackbar
          open={error}
          message={error}
          type="error"
          onClose={() => setError(null)}
        />
      )}

      <Modal open={open} onClose={closeModal}>
        <ModalTitle id="modal-title">
          <Text type="h2"> Form {data?.id} Versions</Text>
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
          style={{
            // display: 'flex',
            justifyContent: 'center',
            padding: '24px',
            paddingBottom: '0px !important',
          }}>
          <TextField
            id="search"
            type="search"
            placeholder="Versions"
            name="search"
            // width="100%"
            icon={
              <span
                style={{color: '#999999', fontSize: '18px'}}
                className="material-symbols-outlined">
                search
              </span>
            }
            onChange={searchHandler}
            style={{color: 'black', marginBottom: '16px'}}
          />
          <Table
            columns={tablecolumns}
            data={data?.content ? data?.content : []}
            sortHandler={sortHandler}
            sortItem={sortItem}
            sortOrder={sortOrder}
            // actionHandler={actionHandler}
            loading={loader}
            progressCircleStyle={{color: '#0a5b99'}}
            message={data?.content?.length === 0 ? <NoDataFound /> : ''}
            style={{
              border: '0px',
              minWidth: '1000px',
            }}
            tableContainerStyle={{
              border: '1px solid #d7d7d7',
              borderBottomLeftRadius: '5px',
              borderBottomRightRadius: '5px',
            }}
            tableHeaderStyle={{height: '40px'}}
          />
          <TablePagination
            PagehandleChange={PagehandleChange}
            currentPage={data?.number + 1}
            data={data}
            pageNo={pageNo}
          />
        </ModalContent>
      </Modal>
    </>
  );
};

export default FormVersionsList;
