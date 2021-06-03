import axios from 'axios';
import latinize from 'latinize';
import store from 'store';
import { showDialog } from 'store/slices/dialogSlice';

export const sendAsync = async (url, data, username, options = {}) => {
   try {
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

      return response.data || null;
   } catch (error) {
      const message = (error.response && error.response.data) ? error.response.data.title : error.message;
      store.dispatch(showDialog({ title: 'En feil har oppstått', body: message }));

      return null;
   }
}

