import { Fragment } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ValidateReguleringsplanforslag from './ValidateReguleringsplanforslag/ValidateReguleringsplanforslag';

function Reguleringsplanforslag({ username }) {
   return (
      <Fragment>
         <div className="paper">
            <Tabs defaultActiveKey="validation" id="tabs" transition={false}>
               <Tab eventKey="validation" title="Validering">
                  <ValidateReguleringsplanforslag username={username} />
               </Tab>
            </Tabs>
         </div>
      </Fragment>
   )
}

export default Reguleringsplanforslag;