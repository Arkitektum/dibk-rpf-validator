import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showDialog } from 'store/slices/dialogSlice';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import InfoIcon from 'assets/gfx/icon-info.svg';
import { createRandomId } from 'utils/utils';
import './RuleSets.scss';

class RuleSets extends Component {
   constructor(props) {
      super(props);

      this.state = {
         ruleSets: null,
         dialogShow: false
      };

      this.showRuleSets = this.showRuleSets.bind(this);
      this.handleOnHide = this.handleOnHide.bind(this);
   }

   handleOnHide() {
      this.setState({ dialogShow: false });
   }

   async showRuleSets(event) {      
      event.preventDefault();
      event.stopPropagation();

      if (!this.state.ruleSets) {
         await this.loadRuleSets();
      }

      this.setState({ dialogShow: true });
   }

   async loadRuleSets() {
      try {
         const response = await axios({
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/regler',
            headers: {
               'system': 'Arkitektum valideringsklient'
            }
         });

         this.setState({ ruleSets: response.data });
      } catch (error) {
         this.props.dispatch(showDialog({ title: 'En feil har oppstått', message: error.message }));
      }
   }

   render() {
      return (
         <React.Fragment>
            <Button variant="link" onClick={this.showRuleSets}>
               <img className="icon-info" src={InfoIcon} alt="Oversikt over valideringsregler" />Oversikt over valideringsregler
            </Button>

            {this.renderDialog()}
         </React.Fragment>
      );
   }

   renderDialog() {
      if (!this.state.ruleSets) {
         return '';
      }

      const ruleCount = this.state.ruleSets.reduce((total, ruleSet) => total + ruleSet.rules.length, 0);

      return (
         <Modal show={this.state.dialogShow} onHide={this.handleOnHide} animation={false} dialogClassName="rule-summary-dialog" centered>
            <Modal.Header closeButton>
               <Modal.Title>Valideringsregler ({ruleCount})</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <div>
                  {this.state.ruleSets.map(ruleSet => this.renderSummary(ruleSet))}
               </div>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="primary" onClick={this.handleOnHide}>Lukk</Button>
            </Modal.Footer>
         </Modal>
      );
   }

   renderSummary(ruleSet) {
      return (
         <div className="ruleset" key={createRandomId()}>
            <h6>{ruleSet.category} ({ruleSet.rules.length})</h6>
            <div className="rules">
               {ruleSet.rules.map(rule => this.renderRule(rule))}
            </div>
         </div>
      );
   }

   renderRule(rule) {
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
}

export default connect(state => state.dialog)(RuleSets);