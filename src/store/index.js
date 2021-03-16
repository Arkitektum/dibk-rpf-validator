import { configureStore } from '@reduxjs/toolkit';
import dialogReducer from './slices/dialogSlice';

export default configureStore({
   reducer: {
      dialog: dialogReducer
   }
});