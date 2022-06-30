import { JsonPrint } from 'components/custom-elements';
import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ValidationResponseRow from './ValidationResponseRow/ValidationResponseRow';
import './ValidationResponse.scss';

function ValidationResponse({ data }) {
   if (!data) {
      return '';
   }

   const rules = data.rules;
   const rulesWithMessages = rules.filter(rule => rule.messages.length > 0);
   const passedRules = rules.filter(rule => rule.status === 'PASSED');
   const skippedRules = rules.filter(rule => rule.status === 'SKIPPED');
   const rulesCheckedCount = rulesWithMessages.length + passedRules.length;
   const timeUsed = data.timeUsed.toString().replace('.', ',');

   return (
      <div className="response-container">
         <div className="row mb-2">
            <div className="col">
               {
                  data.errors === 0 ?
                     <b className="passed">Datasettet validerer i henhold til gjeldende valideringsregler</b> :
                     <b className="failed">Datasettet validerer ikke i henhold til gjeldende valideringsregler</b>
               }
            </div>
         </div>               
         <div className="summary">
            <div className="row">
               <div className="col-2">Datasett:</div>
               <div className="col-10">{data.files.join(', ')}</div>
            </div>
            <div className="row">
               <div className="col-2">Feil:</div>
               <div className="col-10">{data.errors}</div>
            </div>
            <div className="row">
               <div className="col-2">Advarsler:</div>
               <div className="col-10">{data.warnings}</div>
            </div>
            <div className="row">
               <div className="col-2">Regler sjekket:</div>
               <div className="col-10">{rulesCheckedCount} av {rules.length} totalt</div>
            </div>
            <div className="row">
               <div className="col-2">Tidsbruk:</div>
               <div className="col-10">{timeUsed} sek.</div>
            </div>
         </div>

         <Tabs transition={false}>
            {
               rulesWithMessages.length ?
                  <Tab eventKey="failed-rules" title={`Regler med feil eller advarsler (${rulesWithMessages.length})`}>
                     {rulesWithMessages.map((element, index) => <ValidationResponseRow key={'failed-rules-' + index} data={element} />)}
                  </Tab> :
                  null
            }
            {
               passedRules.length ?
                  <Tab eventKey="passed-rules" title={`Validerte regler (${passedRules.length})`}>
                     {passedRules.map((element, index) => <ValidationResponseRow key={'passed-rules-' + index} data={element} />)}
                  </Tab> :
                  null
            }
            {
               skippedRules.length ?
                  <Tab eventKey="skipped-rules" title={`Regler som ikke er sjekket (${skippedRules.length})`}>
                     {skippedRules.map((element, index) => <ValidationResponseRow key={'skipped-rules-' + index} data={element} />)}
                  </Tab> :
                  null
            }
            <Tab eventKey="json-response" title="Svar fra API">
               <JsonPrint data={data} />
            </Tab>
         </Tabs>
      </div>
   );
}

export default ValidationResponse;