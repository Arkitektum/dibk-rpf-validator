import { createSlice } from '@reduxjs/toolkit';

const initialState = {
   loading: false
};

export const apiSlice = createSlice({
   name: 'api',
   initialState,
   reducers: {
      toggleLoading: (state, action) => {   
         Object.assign(state, action.payload);
      }
   }
})

export const { toggleLoading } = apiSlice.actions

export default apiSlice.reducer