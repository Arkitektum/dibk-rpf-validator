import axios from 'axios';
import latinize from 'latinize';
import store from 'store';
import { toggleLoading } from 'store/slices/apiSlice';
import { showDialog } from 'store/slices/dialogSlice';

export const sendAsync = async (url, data, username, options = {}) => {
   try {
      store.dispatch(toggleLoading({ loading: true }));

      const defaultOptions = {
         method: 'post',
         url,
         data,
         headers: {
            'Content-Type': 'multipart/form-data',
            'system': 'Arkitektum demonstrator' + (username ? ` v/${latinize(username)}` : '')
         }
      };

      const response = await axios(Object.assign(defaultOptions, options));
      store.dispatch(toggleLoading({ loading: false }));

      return response.data || null;
   } catch (error) {
      const message = (error.response && error.response.data) ? error.response.data.title : error.message;
      store.dispatch(toggleLoading({ loading: false }));
      store.dispatch(showDialog({ title: 'En feil har oppstått', body: message, className: 'error-dialog' }));

      return null;
   }
}

