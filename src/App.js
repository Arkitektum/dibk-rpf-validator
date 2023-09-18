import { useState } from 'react';
import { Provider } from 'react-redux';
import { Form, Tab, Tabs, Button } from 'react-bootstrap';
import { VarselOmPlanoppstart, HøringOgOffentligEttersyn, Reguleringsplanforslag, Conversion } from 'components/partials';
import { Dialog } from 'components/custom-elements';
import store from 'store';
import Logo from 'assets/gfx/logo-dibk.svg';
import './App.scss';
import { useAuth } from "react-oidc-context"

const App = () => {
   const [username, setUsername] = useState('');
   const auth = useAuth();
   const [awaitTokenLoader, setAwaitTokenLoader] = useState(false); 

   const idPortenButton = auth.isAuthenticated ? <Button onClick={auth.signoutRedirect }>Logg ut av ID-porten</Button> : <Button onClick={auth.signinRedirect}>ID-porten logg inn</Button>;
   const getTokenButton = auth.isAuthenticated ? awaitTokenLoader ?  <div class="loader"></div> : <Button onClick={handleTokenClipboardAlert}>Kopier Altinntoken</Button> : <></>;

   async function handleTokenClipboardAlert(){
      setAwaitTokenLoader(true);
      var token = await ExchangeAltinnToken();
      if (token != null){
         navigator.clipboard.writeText(token);
         alert("Altinntoken er kopiert til din utklippstavle!")
      }else{
         alert("Noe gikk galt ved utveksling av Altinntoken.")
      }
      setAwaitTokenLoader(false);
   }

   async function ExchangeAltinnToken() {

      const idPortenTokenBearer = auth.user?.access_token;
      const bearerPayload = {
         "idPortenToken": idPortenTokenBearer
      };
      let altinnToken = null;
      try {
         altinnToken = await AltinnExchangeCall(bearerPayload);

         if (altinnToken == null) {
            try {
               const newBearer = {
                  "idPortenToken": auth.user?.access_token
               };
               altinnToken = await AltinnExchangeCall(newBearer);
            } catch (exception) {
               throw exception;
            }
         } else {
            return altinnToken;
         }
      } catch {
         return null;
      }
   }

   async function AltinnExchangeCall(bearerPayload) {
      try {
         const response = await fetch("https://dibk.apps.tt02.altinn.no/dibk/varselplanoppstart/exchangealtinntoken", {
            method: "post",
            body: JSON.stringify(bearerPayload),
            headers: {
               'Content-Type': 'application/json',
            }
         });
         let altinnToken = null;

         if (response.status === 200 || response.status === 201) {
            await response.text().then(function (data) {
               altinnToken = data;
            });
         }
         return altinnToken;
      } catch (e) {
         return null;
      }
   }
  
   return (
      <Provider store={store}>
         <div className="App">
            <div className="container">
               <header>
                  <h1>
                     <img src={Logo} alt="DiBK" />
                     <div>
                        <span>Demonstrator</span>
                        <span>Fellestjenester PLAN</span>
                     </div>
                  </h1>
               </header>

               <div className="row mb-4">
                  <div className="col-2">
                     <Form.Control
                        type="text"
                        value={username}
                        required
                        placeholder="Brukernavn"
                        onChange={event => setUsername(event.target.value)}
                     />
                  </div>
               </div>

               <div className="row mb-4">
                  <div className="col-1">
                     {idPortenButton}
                  </div>
                  <div className="col-1">
                     {getTokenButton}
                  </div>
               </div>

               <div className="app-container">
                  <Tabs defaultActiveKey="varsel-om-planoppstart" id="tabs" transition={false}>
                     <Tab eventKey="varsel-om-planoppstart" title="Varsel om planoppstart">
                        <VarselOmPlanoppstart username={username} />
                     </Tab>
                     <Tab eventKey="høring-og-offentlig-ettersyn" title="Høring og offentlig ettersyn">
                        <HøringOgOffentligEttersyn username={username} />
                     </Tab>
                     <Tab eventKey="reguleringsplanforslag" title="Reguleringsplanforslag">
                        <Reguleringsplanforslag username={username} />
                     </Tab>
                     <Tab eventKey="conversion" title="Konvertering">
                        <Conversion username={username} />
                     </Tab>
                  </Tabs>
               </div>
            </div>
         </div>
         <Dialog />
      </Provider>
   );
}

export default App;
