import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InfoIcon from 'assets/gfx/icon-info.svg';
import { createRandomId, sendAsync } from 'utils';
import './RuleSets.scss';

const RuleSets = ({ apiUrl, username }) => {
   const [ruleSets, setRuleSets] = useState(null);
   const [dialogShow, setDialogShow] = useState(false);

   const handleClose = () => setDialogShow(false);

   const showRuleSets = async event => {
      event.preventDefault();
      event.stopPropagation();

      if (!ruleSets) {
         await loadRuleSets();
      }

      setDialogShow(true);
   }

   const loadRuleSets = async () => {
      const data = await sendAsync(apiUrl, null, username, { method: 'get' });

      if (data) {
         setRuleSets(data);
      }
   }

   const renderDialog = () => {
      if (!ruleSets) {
         return '';
      }

      const ruleCount = ruleSets.reduce((total, ruleSet) => total + ruleSet.rules.length, 0);

      return (
         <Modal show={dialogShow} onHide={handleClose} animation={false} dialogClassName="rule-summary-dialog" centered>
            <Modal.Header closeButton>
               <Modal.Title>Valideringsregler ({ruleCount})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div>
                  {ruleSets.map(ruleSet => renderSummary(ruleSet))}
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" onClick={handleClose}>Lukk</Button>
            </Modal.Footer>
         </Modal>
      );
   }

   const renderSummary = ruleSet => {
      return (
         <div className="ruleset" key={createRandomId()}>
            <h6>{ruleSet.category} ({ruleSet.rules.length})</h6>
            <div className="rules">
               {ruleSet.rules.map(rule => renderRule(rule))}
            </div>
         </div>
      );
   }

   const renderRule = rule => {
      return (
         <div key={createRandomId()} className="rule">
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

         {renderDialog()}
      </React.Fragment>
   );
}

export default RuleSets;