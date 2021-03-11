import React from 'react';
import { Component } from 'react';
import ResponseBlock from './ResponseBlock/ResponseBlock';
import './Response.scss';

class Response extends Component {
   constructor(props) {
      super(props);

      this.state = {
         passedRulesExpanded: false
      }

      this.expandPassedRules = this.expandPassedRules.bind(this);
   }

   expandPassedRules() {
      this.setState({ passedRulesExpanded: !this.state.passedRulesExpanded });
   }

   render() {
      const data = this.props.data;

      if (!data) {
         return '';
      }

      const rulesWithMessages = data.validationRules.filter(rule => rule.messages.length > 0);
      const passedRules = data.validationRules.filter(rule => rule.status === 'PASSED');
      const skippedRules = data.validationRules.filter(rule => rule.status === 'NOT_EXECUTED');
      const rulesCheckedCount = rulesWithMessages.length + passedRules.length;
      const timeUsed = data.duration.toString().replace('.', ',');

      return (
         <React.Fragment>
            <div className="summary">
               Antall feil: {data.errors}<br />
               Antall advarsler: {data.warnings}<br />
               Antall regler sjekket: {rulesCheckedCount}<br />
               Antall regler totalt: {data.validationRules.length}<br />
               Tidsbruk: {timeUsed} sek.
            </div>

            <ResponseBlock list={rulesWithMessages} title="Regler med feil eller advarsler" expandable={false} maxHeight={false} />
            <ResponseBlock list={passedRules} title="Validerte regler" />
            <ResponseBlock list={skippedRules} title="Regler som ikke er sjekket" />
         </React.Fragment>
      );
   }
}

export default Response