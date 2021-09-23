import { useState } from 'react';
import { Provider } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { ConvertPlanbestemmelser, SubmitVarselPlanoppstart, ValidatePlanforslag, ValidatePlangrense, ValidateVarselPlanoppstart } from 'components/partials';
import { Dialog } from 'components/custom-elements';
import store from 'store';
//import 'config/map.config';
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

               <div className="row mb-4">
                  <div className="col-3">
                     <Form.Control type="text" value={username} required placeholder="Ditt navn..." onChange={event => setUsername(event.target.value)} />
                  </div>
               </div>

               <div className="app-container">
                  <Tabs defaultActiveKey="submit-varsel-planoppstart" id="tabs" transition={false}>
                     <Tab eventKey="submit-varsel-planoppstart" title="Innsending av varsel om planoppstart">
                        <SubmitVarselPlanoppstart username={username} />
                     </Tab>
                     <Tab eventKey="validate-varsel-planoppstart" title="Validering av varsel om planoppstart">
                        <ValidateVarselPlanoppstart username={username} />
                     </Tab>
                     <Tab eventKey="validate-plangrense" title="Validering av plangrense">
                        <ValidatePlangrense username={username} />
                     </Tab>                     
                     <Tab eventKey="validate-planforslag" title="Validering av reguleringsplanforslag">
                        <ValidatePlanforslag username={username} />
                     </Tab>
                     <Tab eventKey="convert-planbestemmelser" title="Konvertering av planbestemmelser">
                        <ConvertPlanbestemmelser username={username} />
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
