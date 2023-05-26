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
   authority: 'https://oidc-ver2.difi.no/idporten-oidc-provider/',
   client_id: '08c2deed-ab80-4926-8952-a36e52fd7400',
   redirect_uri: 'http://localhost:3000',
   post_logout_redirect_uri: 'http://localhost:3000',
   response_type: 'code',
   scope: 'openid profile',
   acr_values: "Level3",
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

