import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { createRandomId } from 'utils/utils';
import './RuleSummary.scss';

const RuleSummary = ({ ruleSets, show, onHide }) => {
   if (!ruleSets) {
      return '';
   }

   const ruleCount = ruleSets.reduce((total, ruleSet) => total + ruleSet.rules.length, 0);

   return (
      <Modal show={show} onHide={onHide} animation={false} dialogClassName="rule-summary-dialog" centered>
         <Modal.Header closeButton>
            <Modal.Title>Valideringsregler ({ruleCount})</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            <div>
               {ruleSets.map(ruleSet => renderSummary(ruleSet))}
            </div>
         </Modal.Body>
         <Modal.Footer>
            <Button variant="primary" onClick={onHide}>Lukk</Button>
         </Modal.Footer>
      </Modal>
   );
};

const renderSummary = (ruleSet) => {
   return (
      <div className="ruleset" key={createRandomId()}>
         <h6>{ruleSet.category} ({ruleSet.rules.length})</h6>
         <div className="rules">
            {ruleSet.rules.map(rule => renderRule(rule))}
         </div>
      </div>
   );
};

const renderRule = (rule) => {
   return (
      <div key={createRandomId()} className="rule">
         <div className="type">
            <span className={`label label-${rule.messageType.toLowerCase()}`}>{rule.messageType}</span>
         </div>
         <div className="name">
            <span>{rule.name}</span>
            {rule.documentation ? <a className="documentation" href={rule.documentation} target="_blank" rel="noreferrer">(Dokumentasjon)</a> : ''}
         </div>
         <div className="id">
            <span className="label label-default">{rule.id}</span>
         </div>
      </div>
   )
};

export default RuleSummary