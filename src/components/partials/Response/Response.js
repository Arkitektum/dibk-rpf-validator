import React from 'react';
import { Component } from 'react';
import ResponseRow from './ResponseRow/ResponseRow';
import { createRandomId } from 'utils/utils';
import './Response.scss';

class Response extends Component {
   render() {
      const data = this.props.data;

      if (!data) {
         return '';
      }

      const rulesWithMessages = data.validationRules.filter(rule => rule.messages && rule.messages.length);
      const rulesCheckedCount = data.validationRules.filter(rule => rule.status !== 'NOT_EXECUTED').length;
      const timeUsed = data.duration.toString().replace('.', ',');

      return (
         <React.Fragment>
            <p>
               Antall feil: {data.errors}<br/>
               Antall advarsler: {data.warnings}<br/>
               Antall regler sjekket: {rulesCheckedCount}<br/>
               Antall regler totalt: {data.validationRules.length}<br />
               Tidsbruk: {timeUsed} sek.
            </p>

            <div className="response">
               {rulesWithMessages.map((rule, index) => <ResponseRow key={createRandomId()} data={rule} />)}
            </div>
         </React.Fragment>
      );
   }
}

export default Response