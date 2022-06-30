import { Fragment } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import SubmitVarselOmPlanoppstart from './SubmitVarselOmPlanoppstart/SubmitVarselOmPlanoppstart';
import Validate from './Validate/Validate';

function VarselOmPlanoppstart({ username }) {
   return (
      <Fragment>
         <div className="paper">
            <Tabs defaultActiveKey="validation" id="tabs" transition={false}>
               <Tab eventKey="validation" title="Validering">
                  <Validate username={username} />
               </Tab>
               <Tab eventKey="submittal" title="Innsending">
                  <SubmitVarselOmPlanoppstart username={username} />
               </Tab>
            </Tabs>
         </div>
      </Fragment>
   )
}

export default VarselOmPlanoppstart;