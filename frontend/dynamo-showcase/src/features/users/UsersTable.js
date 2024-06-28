import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Divider, Grid} from '@mui/material';
import {
  Button,
  Chip,
  Menu,
  MenuItem,
  Table,
  Text,
  TextField,
} from 'glide-design-system';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import {makeStyles} from '@material-ui/core';
import 'rsuite/dist/rsuite-no-reset.min.css';
import {DatePicker} from 'rsuite';
// import {DateRangePicker} from 'rsuite';
import CloseIcon from '@mui/icons-material/Close';

import {
  fetchUser,
  getLoader,
  handleSuspendModal,
  handleReactivateModal,
  handleEditUserModal,
  setInitialValue,
  page,
  handlePagination,
  handleSort,
  getAllUsers,
} from './userSlice';
import susupendIcon from '../../assets/icon/suspend_menu.svg';
import Reactivate from '../../assets/icon/reactivate_menu.svg';
import searchIcon from '../../assets/icon/search_icon.svg';
import TablePagination from '../../components/pagination/TablePagination';
import {statusBackgroundColor} from '../../utils/helperFunction';
import {traceSpan} from '../../helpers/tracing';

const options = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'GMT',
};

const UsersTable = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const users = useSelector(getAllUsers);
  const loader = useSelector(getLoader);
  const [sortOrder, setSortOrder] = useState('');
  const [sortItem, setSortItem] = useState('createdOn');
  const [showMenu, setShowMenu] = useState(null);
  const currentPage = useSelector(page);
  const [pageNo, setPageNo] = useState(0);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');

  const [searchDate, setSearchDate] = useState('');
  const [searchDateValue, setSearchDateValue] = useState(null);
  const [role, setRole] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [rowindex, setRowIndex] = useState();
  const open = Boolean(showMenu);

  const [selectedDates, setSelectedDates] = useState(null);
  const dateRangeRef = React.createRef();

  // closes action menu
  const closeMenu = () => {
    setShowMenu(null);
  };

  // columns of the table
  const tablecolumns = [
    {
      label: 'email',
      fieldName: 'email',
      sort: true,
      style: {
        textAlign: 'left',
      },
      type: 'email',
    },
    {
      label: 'name',
      fieldName: 'name',
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        return (
          <div
            style={{
              textTransform: 'capitalize',
              alignItems: 'center',
              // fontSize: '14px',
            }}>
            {rowItem?.firstName || rowItem?.lastName
              ? `${rowItem?.firstName}  ${rowItem?.lastName}`
              : '-'}
          </div>
        );
      },
    },
    {
      label: 'role',
      fieldName: 'roles',
      style: {
        textAlign: 'left',
        textTransform: 'capitalize',
      },
    },
    {
      label: 'phoneNumber',
      fieldName: 'phoneNumber',
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        return (
          <div
            style={{
              alignItems: 'center',
              // fontSize: '14px',
            }}>
            {rowItem?.phoneNumber && <Text>{rowItem?.phoneNumber}</Text>}
            {!rowItem?.phoneNumber && <Text>-</Text>}
          </div>
        );
      },
    },
    {
      label: 'status',
      fieldName: 'status',
      style: {
        textAlign: 'left',
      },
      customBodyRenderer: rowItem => {
        return (
          <Chip
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              padding: '5px',
              // fontSize: '12px',
              fontWeight: 400,
              textTransform: 'capitalize',
              backgroundColor: statusBackgroundColor(rowItem?.status),
              color: '#333333',
            }}>
            {rowItem?.status}
          </Chip>
        );
      },
    },
    {
      label: 'createdDate',
      fieldName: 'createdOn',
      sort: true,
      type: 'date',
      style: {
        textAlign: 'left',
      },
    },

    {
      label: 'actions',
      style: {
        textAlign: 'left',
      },
      element: (
        <span
          className="material-symbols-outlined"
          style={{
            fontWeight: 500,
            height: '10px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '40px',
          }}>
          more_horiz
        </span>
      ),
    },
  ];

  // table data (users list)
  const tableData = users.content ? users?.content : [];
  /**
   * Action menu is opened on which the user is clicked
   * @param {*} e element
   * @param {*} value row value
   */
  const actionHandler = async (e, value) => {
    const index = await users?.content?.findIndex(
      item => item?.userId === value?.userId,
    );
    setRowIndex(index);
    setShowMenu(e);
  };

  /**
   * sort table data
   * @param {*} sortOrder on which order the data should be sorted
   * @param {*} sortItem which item should be sorted
   */
  const sortHandler = (sortOrder, sortItem) => {
    const updatedSortItem = sortItem?.startsWith('created')
      ? sortItem?.replace(/o/g, 'O')?.split(' ')?.join('')
      : sortItem;
    setSortItem(updatedSortItem);
    setSortOrder(sortOrder);
    dispatch(handleSort({sortOrder, sortItem}));
  };

  /**
   * Pagination of user table
   * @param {*} value page number
   */
  const PagehandleChange = value => {
    setPageNo(value - 1);
    dispatch(handlePagination(value - 1));
  };

  /**
   * Opens suspend user modal
   * @param {*} data selected user data
   * Selected user data is set to initial value in slice to get user id
   */
  const openSuspendModal = async data => {
    await dispatch(setInitialValue(data));
    setTimeout(() => {
      dispatch(handleSuspendModal());
    }, [100]);
  };

  /**
   * Opens reactivate user modal
   * @param {*} data selected user data
   * Selected user data is set to initial value in slice to get user id
   */
  const openReactivateModal = async data => {
    await dispatch(setInitialValue(data));
    setTimeout(() => {
      dispatch(handleReactivateModal());
    }, [100]);
  };

  /**
   * Opens edit user modal
   * @param {*} data selected user data
   * Selected user data is set to initial value in slice to get user id
   */
  const openEditUserModal = async data => {
    await dispatch(setInitialValue(data));
    setTimeout(() => {
      dispatch(handleEditUserModal());
    }, [100]);
  };

  /**
   * Search data on value change
   * @param {*} data input value
   */
  const searchHandler = data => {
    // traceSpan('Search User: ', async () => {
    setSearch(data?.target?.value);
    // });
  };

  const handleDatesSearch = value => {
    setSelectedDates(value);
    if (value) {
      //setSearchDateValue(value)
      setSearchDate(new Date(value[1]).toISOString());
    } else {
      setSearchDate('');
      //setSearchDateValue(null)
    }
  };

  const handleClearButtonClick = () => {
    setSelectedDates('');
    setRole('');
    setSearch('');
    setUserStatus('');
    setDate(null);
  };

  /**
   * filter data based on role
   * @param {*} data selected value
   */
  const filterRole = data => {
    // traceSpan('Filter Role: ', async () => {
    setRole(data.target?.value);
    // });
  };

  const filterStatus = data => {
    // traceSpan('Filter status: ', async () => {
    setUserStatus(data.target?.value);
    // });
  };

  // fetch user is executed on page load and when search,pageNo,role value is updated with search,pageNo,role value as props
  useEffect(() => {
    // dispatch(closeNotification());
    // traceSpan('Fetching user', async () => {
    dispatch(
      fetchUser({
        search,
        role,
        pageNo,
        sortItem,
        sortOrder,
        userStatus,
        date,
      }),
    );
    // });
  }, [
    search,
    pageNo,
    role,
    sortItem,
    sortOrder,
    userStatus,
    searchDate,
    selectedDates,
    date,
  ]);

  return (
    <div style={{padding: '0px 24px'}}>
      <div className={classes.container}>
        <Grid
          container
          display="flex"
          flexDirection="row"
          alignItems="center"
          spacing={2}>
          <Grid item xs={12} md={3} lg={2}>
            <TextField
              id="search"
              type="search"
              value={search === null ? '' : search}
              placeholder="Search Name"
              width="100%"
              icon={<span className="material-symbols-outlined">search</span>}
              onChange={searchHandler}
              style={{color: 'black', borderColor: '#D7D7D7', height: '36px'}}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: '36px',
              }}>
              <select
                id="role"
                placeholder="Role"
                value={role}
                onChange={filterRole}
                className={classes.select}>
                <option disabled value="">
                  Role
                </option>
                {/* <option value="super_admin">Super Admin</option> */}
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                height: '36px',
              }}>
              <select
                id="status"
                placeholder="status"
                value={userStatus}
                onChange={filterStatus}
                className={classes.select}>
                <option disabled value="">
                  Status
                </option>
                {/* <option value="super_admin">Super Admin</option> */}
                <option value="active">Active</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
              </select>
              {/* <Button
                color="secondary"
                id="reset-btn"
                style={{ marginLeft: '15px' }}
                icon={<CloseIcon />}
                onClick={() => {
                  setRole('');
                }}>
                Reset
              </Button> */}
            </div>
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <DatePicker
                format="MM-dd-yyyy"
                placeholder="mm-dd-yyyy"
                size="md"
                style={{width: '100%'}}
                // placeholder="Date"
                // cleanable={false}
                onClean={e => {
                  e.target.value = '';
                  setDate(null);
                }}
                onChange={(val, e) => {
                  setDate(val);
                }}
                value={date}
                renderValue={date => {
                  return `${new Date(date).toLocaleDateString(
                    'en-EN',
                    options,
                  )}`;
                }}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={3} lg={2}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {(date || userStatus || role || search) && (
                <Button
                  className={classes.button}
                  id="reset-btn"
                  // icon={<span className="material-symbols-outlined">close</span>}
                  onClick={handleClearButtonClick}>
                  Reset
                </Button>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
      <div
        style={{
          border: '1px solid #d7d7d7',
          borderRadius: '5px',
          boxShadow: '0px 0px 5px 0px #a5a5a5',
        }}>
        <Table
          columns={tablecolumns}
          data={tableData}
          sortHandler={sortHandler}
          sortItem={sortItem}
          sortOrder={sortOrder}
          actionHandler={actionHandler}
          loading={loader}
          progressCircleStyle={{color: '#0a5b99'}}
          message={users?.content?.length === 0 ? 'No users found' : ''}
          style={{
            border: '0px',
            minWidth: '1000px',
          }}
          tableContainerStyle={{
            border: '1px solid #d7d7d7',
          }}
          tableHeaderStyle={{height: '40px', backgroundColor: '#E6EBF2'}}
        />
      </div>
      <Menu
        anchorEl={showMenu}
        open={open}
        onClose={closeMenu}
        id="action-menu"
        style={{
          minWidth: '118px',
        }}>
        <MenuItem
          className={classes.menuItem}
          disabled={users?.content?.[rowindex]?.status === 'Invited'}
          id="edit-opt"
          style={{
            opacity:
              users?.content?.[rowindex]?.status === 'Invited' ? '0.5' : '1',
            pointerEvents:
              users?.content?.[rowindex]?.status === 'Invited' ? 'none' : '',
          }}
          icon={
            <EditOutlinedIcon
              style={{
                fontSize: '22px',
                marginRight: '8px',
                marginLeft: '12px',
              }}
            />
          }
          onClick={() => {
            // traceSpan('Open Edit', async () => {
            openEditUserModal(users?.content[rowindex]);
            closeMenu();
            // });
          }}>
          Edit
        </MenuItem>
        <Divider />
        {users?.content?.[rowindex]?.status === 'suspended' && (
          <MenuItem
            className={classes.menuItem}
            disabled={users?.content?.[rowindex]?.status === 'invited'}
            id="reactivate-opt"
            style={{
              opacity:
                users?.content?.[rowindex]?.status === 'Invited' ? '0.5' : '1',
              pointerEvents:
                users?.content?.[rowindex]?.status === 'Invited' ? 'none' : '',
            }}
            icon={
              <span
                class="material-symbols-outlined"
                style={{marginRight: '8px', marginLeft: '12px'}}>
                autorenew
              </span>
            }
            onClick={() => {
              // traceSpan('Open Reactivate user', async () => {
              openReactivateModal(users?.content[rowindex]);
              closeMenu();
              // });
            }}>
            Reactivate
          </MenuItem>
        )}
        {users?.content?.[rowindex]?.status === 'active' && (
          <MenuItem
            className={classes.menuItem}
            disabled={users?.content?.[rowindex]?.status === 'invited'}
            style={{
              opacity:
                users?.content?.[rowindex]?.status === 'invited' ? '0.5' : '1',
              pointerEvents:
                users?.content?.[rowindex]?.status === 'invited' ? 'none' : '',
            }}
            id="suspend-opt"
            icon={
              <span
                class="material-symbols-outlined"
                style={{marginRight: '8px', marginLeft: '12px'}}>
                stop_circle
              </span>
            }
            onClick={() => {
              // traceSpan('Open Suspend User', async () => {
              openSuspendModal(users?.content[rowindex]);
              closeMenu();
              // });
            }}>
            Suspend
          </MenuItem>
        )}
      </Menu>
      <TablePagination
        PagehandleChange={PagehandleChange}
        currentPage={currentPage + 1}
        data={users}
        pageNo={pageNo}
      />
    </div>
  );
};

export default UsersTable;

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid #DDD',
    borderRadius: '5px',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
    padding: '25px',
    marginBottom: '16px',
    boxShadow: '0px 0px 5px 0px #a5a5a5',
  },
  select: {
    width: '300px',
    borderRadius: '5px',
    border: '1px solid #999999',
    backgroundColor: 'transparent',
    borderColor: '#D7D7D7',
    color: 'black',
  },
  durationField: {
    '& .rs-picker-toggle-wrapper': {
      display: 'inline-block',
      maxWidth: '100%',
      verticalAlign: 'middle',
    },
    '&.rs-picker-default .rs-picker-toggle': {
      //border: 'none !important',
      marginLeft: '1px',
      border: '1px solid !important',
      borderRadius: '5px',
      backgroundColor: 'black',
      width: '293px',
      borderColor: '#D7D7D7 !important',
    },
  },
  datePicker: {
    border: '1px solid',
    borderRadius: '2px !important',
    borderColor: '#D7D7D7 !important',
  },
  menuItem: {
    cursor: 'pointer',
    width: '100%',
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#1B3764 !important',
    minWidth: 'auto',
    '&:hover': {
      backgroundColor: '#3a5d95 !important',
    },
  },
}));
