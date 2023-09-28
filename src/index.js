import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { AuthProvider } from "react-oidc-context";
import{WebStorageStateStore} from "oidc-client-ts"
//import 'ol/ol.css';
import App from './App';

window.onbeforeunload = () => {
   window.scrollTo(0, 0);
};

const oidcConfig = {
   authority: 'https://test.idporten.no',
   client_id: 'e8036c98-a703-4cbd-8028-3434cf23a4fe',
   redirect_uri: 'https://dibk-rpf-validator.azurewebsites.net',
   post_logout_redirect_uri: 'https://dibk-rpf-validator.azurewebsites.net',
   response_type: 'code',
   scope: 'openid profile',
   acr_values: "idporten-loa-substantial",
   ui_locales: "nb",
   automaticSilentRenew: true,
   userStore: new WebStorageStateStore({
      store: localStorage
    }),
   //resource: "arkitektum:ansakointernalapi",
   revokeAccessTokenOnSignout: true,
}
const onSigninCallback = () => {
   window.history.replaceState(
       {},
       document.title,
       window.location.pathname
   )
}

ReactDOM.render(
   <React.StrictMode>
      <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
         <App />
      </AuthProvider>
   </React.StrictMode>,
   document.getElementById('root')
);

