import { Fragment } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ConvertPlanbestemmelser from './ConvertPlanbestemmelser/ConvertPlanbestemmelser';
import Gml2Sosi from './Gml2Sosi/Gml2Sosi';

function Conversion({ username }) {
   return (
      <Fragment>
         <div className="paper">
            <Tabs defaultActiveKey="gml2sosi" id="tabs" transition={false}>
               <Tab eventKey="gml2sosi" title="GML til SOSI">
                  <Gml2Sosi username={username} />
               </Tab>
               <Tab eventKey="planbestemmelser" title="Planbestemmelser">
                  <ConvertPlanbestemmelser username={username} />
               </Tab>
            </Tabs>
         </div>
      </Fragment>
   );
}

export default Conversion;