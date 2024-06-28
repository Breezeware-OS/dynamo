import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {API, Auth} from 'aws-amplify';
import BackendService from '../../service/BackendService';
import {logError, logdebug, loginfo, traceSpan} from '../../helpers/tracing';

const initialState = {
  userList: [], // list of users
  status: 'idle', // status of api calls
  error: '', // error message
  notification: false, // to display notification
  loading: false, // to display loader
  showSuspendUserModal: false, // to display suspend user modal
  showReactivateModal: false, // to display reactivate user modal
  showEditUserModal: false, // to display edit user modal
  initialUservalue: null, // initial value of user
  notificationMessage: null, // notification message to display
  currentPage: 0, // current page the user is in
  pageSize: 8, // size of the table
  sortItem: null,
  sortOrder: 'asc', // sort direction
};

/**
 * Fetch list of users
 * returns list of users
 */
export const fetchUser = createAsyncThunk('users/fetchUsers', async data => {
  // traceSpan('fetchUser', async () => {
  const response = await BackendService.usersList(data);

  return response?.data;
  // });
  // logdebug('Retrieve User List', response);
  // console.log(response);

  // return response;
  // });
});

/**
 * Invite user
 */
export const inviteUser = createAsyncThunk('users/inviteUser', async data => {
  // traceSpan('Invite User', async () => {
  await BackendService.inviteUser(data)
    .then(response => {
      // logdebug('Invite User Success', response);
      return response;
    })
    .catch(err => {
      // logError('Invite User Failure', err);
      // return err;
      throw new Error(err?.response?.data?.details[0]);
    });
  // });
});

/**
 * Update existing user
 */
export const editUser = createAsyncThunk('users/editUser', async data => {
  // traceSpan('Update User', async () => {
  await BackendService.editUser(data)
    .then(response => {
      // logdebug('Edit User Success', response);
      return response?.data;
    })
    .catch(err => {
      // logError('Edit User Failure', err);
      // return err;
      throw new Error(err?.response?.data?.details[0]);
    });
  // });
});

/**
 * Enable suspended user
 */
export const enableUser = createAsyncThunk('users/enableUser', async data => {
  // traceSpan('Reactivate user', async () => {
  await BackendService.reactivateUser(data)
    .then(response => {
      // loginfo('Enable User Success', response);
      return response?.data;
    })
    .catch(err => {
      // logError('Enable User Failure', err);
      // return err;
      throw new Error(err?.response?.data?.details[0]);
    });
  // });
});

/**
 * Suspend active user
 */
export const disableUser = createAsyncThunk('users/disableUser', async data => {
  // traceSpan('Suspend user', async () => {
  await BackendService.suspendUser(data)
    .then(response => {
      // loginfo('Disable User Success', response);

      return response?.data;
    })
    .catch(err => {
      // logError('Disable User Failure', err);

      // return err;
      throw new Error(err?.response?.data?.details[0]);
    });
  // });
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    // closes notification
    closeNotification: (state, action) => {
      state.notification = false;
    },

    // opens or closes suspend user modal
    handleSuspendModal: (state, action) => {
      state.showSuspendUserModal = !state.showSuspendUserModal;
    },

    // opens or closes reactivate user modal
    handleReactivateModal: (state, action) => {
      state.showReactivateModal = !state.showReactivateModal;
    },

    // opens or closes edit user modal
    handleEditUserModal: (state, action) => {
      state.showEditUserModal = !state.showEditUserModal;
    },

    // updates value of user
    // which is used to get id or data of user
    setInitialValue: (state, action) => {
      // logdebug('Setting initial value', action.payload);
      state.initialUservalue = action.payload;
    },

    // updates current page number
    handlePagination: (state, action) => {
      state.currentPage = action.payload;
    },

    handleSort: (state, action) => {
      state.sortItem = action.payload?.sortItem;
      state.sortOrder = action.payload?.sortOrder;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        // state.status = 'loading';
        state.loading = true;
        // state.error = false;
        // state.notification = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        // logdebug('fetchUser.fulfilled', action.payload);
        // setTimeout(() => {
        state.currentPage = action.payload?.number;
        state.pageSize = action.payload?.size;
        state.loading = false;
        state.error = false;
        state.userList = action?.payload?.content ? action?.payload : [];
        // }, 2000);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = true;
        state.notification = true;
        state.loading = false;
        state.notificationMessage = action.error.message;
      })

      .addCase(inviteUser.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.notification = false;
      })
      .addCase(inviteUser.fulfilled, (state, action) => {
        state.status = 'invited';
        state.notification = true;
        state.loading = false;
        state.error = false;
        state.notificationMessage = 'User Invited Successfully';
      })
      .addCase(inviteUser.rejected, (state, action) => {
        state.error = true;
        state.notification = true;
        state.loading = false;
        state.notificationMessage = action.error.message;
      })
      .addCase(editUser.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.notification = false;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.status = 'updated';
        state.notification = true;
        state.loading = false;
        state.error = false;
        state.notificationMessage = 'User Updated Successfully';
      })
      .addCase(editUser.rejected, (state, action) => {
        state.error = true;
        state.notification = true;
        state.loading = false;
        state.notificationMessage = action.error.message;
      })
      .addCase(enableUser.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.notification = false;
      })
      .addCase(enableUser.fulfilled, (state, action) => {
        state.status = 'updated';
        state.notification = true;
        state.loading = false;
        state.error = false;
        state.notificationMessage = 'User Re-activated Successfully';
      })
      .addCase(enableUser.rejected, (state, action) => {
        state.error = true;
        state.notification = true;
        state.loading = false;
        state.notificationMessage = action.error.message;
      })
      .addCase(disableUser.pending, (state, action) => {
        state.loading = true;
        state.error = false;
        state.notification = false;
      })
      .addCase(disableUser.fulfilled, (state, action) => {
        state.status = 'updated';
        state.notification = true;
        state.loading = false;
        state.error = false;
        state.notificationMessage = 'User Suspended Successfully';
      })
      .addCase(disableUser.rejected, (state, action) => {
        state.error = true;
        state.notification = true;
        state.loading = false;
        state.notificationMessage = action.error.message;
      });
  },
});

export const getAllUsers = state => state.users.userList;

export const getUsersStatus = state => state.users.status;
export const getUsersError = state => state.users.error;
export const getInviteStatus = state => state.users.notification;
export const getLoader = state => state.users.loading;
export const reactivateModal = state => state.users.showReactivateModal;
export const suspendModal = state => state.users.showSuspendUserModal;
export const editUserModal = state => state.users.showEditUserModal;
export const initialValue = state => state.users.initialUservalue;
export const message = state => state.users.notificationMessage;
export const page = state => state.users.currentPage;
export const size = state => state.users.pageSize;

export const {
  closeNotification,
  handleReactivateModal,
  handleSuspendModal,
  handleEditUserModal,
  setInitialValue,
  handlePagination,
  handleSort,
} = usersSlice.actions;

export default usersSlice.reducer;
