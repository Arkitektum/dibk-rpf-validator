import { useState } from 'react';
import { Provider } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { ConvertPlanbestemmelser, ValidatePlanforslag, ValidatePlanomriss } from 'components/partials';
import { Dialog } from 'components/custom-elements';
import store from './store';
import Logo from 'assets/gfx/logo-dibk.svg';
import './App.scss';

const App = () => {
   const [username, setUsername] = useState('');

   return (
      <Provider store={store}>
         <div className="App">
            <div className="container">
               <header>
                  <h1>
                     <img src={Logo} alt="DiBK" />Fellestjenester PLAN |<span>Demonstrator</span>
                  </h1>
               </header>

               <div className="row mb-3">
                  <div className="col-3">
                     <Form>
                        <Form.Group controlId="formUsername">
                           <Form.Label>Brukernavn</Form.Label>
                           <Form.Control required type="text" onChange={event => setUsername(event.target.value)} />
                        </Form.Group>
                     </Form>
                  </div>
               </div>

               <Tabs defaultActiveKey="validate-planforslag" id="tabs" transition={false}>
                  <Tab eventKey="validate-planforslag" title="Validering av reguleringsplanforslag">
                     <ValidatePlanforslag username={username} />
                  </Tab>
                  <Tab eventKey="validate-planomriss" title="Validering av planomriss">
                     <ValidatePlanomriss username={username} />
                  </Tab>
                  <Tab eventKey="convert-planbestemmelser" title="Konvertering av planbestemmelser">
                     <ConvertPlanbestemmelser username={username} />
                  </Tab>
               </Tabs>
            </div>
         </div>
         <Dialog />
      </Provider>
   );
}

export default App;
