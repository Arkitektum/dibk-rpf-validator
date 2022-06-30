import { Fragment } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import SumbitHøringOgOffentligEttersyn from './SumbitHøringOgOffentligEttersyn/SumbitHøringOgOffentligEttersyn';
import Validate from './Validate/Validate';

function HøringOgOffentligEttersyn({ username }) {
   return (
      <Fragment>
         <div className="paper">
            <Tabs defaultActiveKey="validation" id="tabs" transition={false}>
               <Tab eventKey="validation" title="Validering">
                  <Validate username={username} />
               </Tab>
               <Tab eventKey="submittal" title="Innsending">
                  <SumbitHøringOgOffentligEttersyn username={username} />
               </Tab>
            </Tabs>
         </div>
      </Fragment>
   )
}

export default HøringOgOffentligEttersyn;