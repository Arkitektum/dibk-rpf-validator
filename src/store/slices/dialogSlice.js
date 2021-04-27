import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   show: false,
   title: null,
   body: null,
   className: null
};

export const dialogSlice = createSlice({
   name: 'dialog',
   initialState,
   reducers: {
      showDialog: (state, action) => {   
         state.show = true;
         Object.assign(state, action.payload);
      },
      hideDialog: state => {
         Object.assign(state, initialState);
      }
   }
})

export const { showDialog, hideDialog } = dialogSlice.actions

export default dialogSlice.reducer