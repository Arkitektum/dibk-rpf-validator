import React from 'react';
import ReactDOMServer from "react-dom/server";
import { useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button';
import InfoIcon from 'assets/gfx/icon-info.svg';
import { showDialog } from 'store/slices/dialogSlice';
import { sendAsync } from 'utils/api';
import './RuleSets.scss';

const RuleSets = ({ apiUrl, username }) => {
   const dispatch = useDispatch();
   let ruleSets = null;

   const showRuleSets = async event => {
      event.preventDefault();
      event.stopPropagation();

      if (!ruleSets) {
         ruleSets = await sendAsync(apiUrl, null, username, { method: 'get' });
      }

      openDialog();
   }

   const openDialog = () => {
      if (!ruleSets) {
         return;
      }

      const ruleCount = ruleSets.reduce((total, ruleSet) => total + ruleSet.rules.length, 0);
      const body = ReactDOMServer.renderToStaticMarkup(renderDialogBody());

      dispatch(showDialog({ title: `Valideringsregler (${ruleCount})`, body, className: 'rule-summary-dialog' }));
   }

   const renderDialogBody = () => {
      return (
         <div>
            {ruleSets.map((ruleSet, index) => renderSummary(ruleSet, index))}
         </div>
      );
   }

   const renderSummary = (ruleSet, index) => {
      return (
         <div className="ruleset" key={index}>
            <h6>{ruleSet.category} ({ruleSet.rules.length})</h6>
            <div className="rules">
               {ruleSet.rules.map((rule, idx) => renderRule(rule, idx))}
            </div>
         </div>
      );
   }

   const renderRule = (rule, index) => {
      return (
         <div key={index} className="rule">
            <div className="type">
               <span className={`label label-${rule.messageType.toLowerCase()}`}>{rule.messageType}</span>
            </div>
            <div className="name">
               <div>
                  <span>{rule.name}</span>
                  {rule.documentation ? <a className="documentation" href={rule.documentation} target="_blank" rel="noreferrer">(Dokumentasjon)</a> : ''}
               </div>
               {rule.description ? <span className="description">{rule.description}</span> : ''}
            </div>
            <div className="id">{rule.id}</div>
         </div>
      )
   }

   return (
      <React.Fragment>
         <Button variant="link" onClick={showRuleSets}>
            <img className="icon-info" src={InfoIcon} alt="Oversikt over valideringsregler" />Oversikt over valideringsregler
         </Button>
      </React.Fragment>
   );
}

export default RuleSets;