import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const docsSlice = createSlice({
  name: 'docs',
  initialState: {
    getData: false, // triggers useEffect whenever create ,edit or other actions done this will trigger
    getCollectionData: false,
    getDocumentData: false,
    openDrawer: false,
  },
  reducers: {
    getData(state) {
      state.getData = !state.getData;
    },
    getCollectionData(state) {
      state.getCollectionData = !state.getCollectionData;
    },
    getDocumentData(state) {
      state.getDocumentData = !state.getDocumentData;
    },
    HandleOpenDrawer(state) {
      state.openDrawer = !state.openDrawer;
    },
  },
});

export const docsSliceActions = docsSlice.actions;
export default docsSlice.reducer;
