import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './slices/dialogSlice';
import apiReducer from './slices/apiSlice';

export default configureStore({
   reducer: {
      dialog: dialogReducer,
      api: apiReducer
   }
});