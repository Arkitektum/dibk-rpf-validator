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

   const idPortenButton = auth.isAuthenticated ? <Button onClick={auth.signoutRedirect }>Logg ut av ID-porten</Button> : <Button onClick={auth.signinRedirect}>ID-porten logg inn</Button>;

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
