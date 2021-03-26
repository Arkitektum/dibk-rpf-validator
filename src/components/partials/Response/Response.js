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
      const timeUsed = data.timeUsed.toString().replace('.', ',');

      return (
         <React.Fragment>
            <div className="summary">
               <div className="row">
                  <div className="col">Datasett:</div>
                  <div className="col">{data.files.join(', ')}</div>
               </div>
               <div className="row">
                  <div className="col">Antall feil:</div>
                  <div className="col">{data.errors}</div>
               </div>
               <div className="row">
                  <div className="col">Antall advarsler:</div>
                  <div className="col">{data.warnings}</div>
               </div>
               <div className="row">
                  <div className="col">Antall regler sjekket:</div>
                  <div className="col">{rulesCheckedCount}</div>
               </div>
               <div className="row">
                  <div className="col">Antall regler totalt:</div>
                  <div className="col">{data.validationRules.length}</div>
               </div>
               <div className="row">
                  <div className="col">Tidsbruk:</div>
                  <div className="col">{timeUsed} sek.</div>
               </div>
            </div>

            <ResponseBlock list={rulesWithMessages} title="Regler med feil eller advarsler" expandable={false} maxHeight={false} />
            <ResponseBlock list={passedRules} title="Validerte regler" />
            <ResponseBlock list={skippedRules} title="Regler som ikke er sjekket" />
         </React.Fragment>
      );
   }
}

export default Response