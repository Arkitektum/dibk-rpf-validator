import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FileInput from 'components/custom-elements/FileInput/FileInput';
import Dialog from 'components/custom-elements/Dialog/Dialog';
import RuleSummary from '../RuleSummary/RuleSummary';
import axios from 'axios';
import InfoIcon from 'assets/gfx/icon-info.svg';
import './Upload.scss';

class Upload extends Component {
   constructor(props) {
      super(props);

      this.state = {
         username: '',
         oversendelse: undefined,
         planbestemmelser: undefined,
         plankart2D: undefined,
         plankart3D: undefined,
         formValidated: false,
         validating: false,
         dialogShow: false,
         dialogMessage: '',
         ruleSets: null,
         ruleSetsShow: false
      };

      this.validate = this.validate.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.showRuleSets = this.showRuleSets.bind(this);
      this.fileInputs = [];

      this.setFileInputRef = element => {
         this.fileInputs.push(element);
      };
   }

   handleSubmit(event) {
      event.preventDefault();
      event.stopPropagation();

      if (event.currentTarget.checkValidity() === true) {
         this.validate();
      }

      this.setState({ formValidated: true })
   }

   canValidate() {
      return this.state.username !== '' &&
         (this.state.oversendelse !== undefined ||
            this.state.planbestemmelser !== undefined ||
            this.state.plankart2D !== undefined ||
            this.state.plankart3D !== undefined);
   }

   reset() {
      this.fileInputs.forEach(fileInput => fileInput.reset());

      this.setState({
         oversendelse: undefined,
         planbestemmelser: undefined,
         plankart2D: undefined,
         plankart3D: undefined,
         validating: false
      });
   }

   async getRuleSets() {
      try {
         const response = await axios({
            method: 'get',
            url: process.env.REACT_APP_API_BASE_URL + '/regler',
            headers: {
               'system': `Arkitektum valideringsklient v/${this.state.username}`
            }
         });

         this.setState({ ruleSets: response.data });
      } catch (error) {
         this.setState({
            dialogShow: true,
            dialogMessage: `En feil har oppstått: ${error}`
         });
      }
   }

   async validate() {
      if (!this.canValidate()) {
         return;
      }

      this.setState({ validating: true });
      const formData = new FormData();

      if (this.state.oversendelse) {
         formData.append('oversendelse', this.state.oversendelse);
      }

      if (this.state.planbestemmelser) {
         formData.append('planbestemmelser', this.state.planbestemmelser);
      }

      if (this.state.plankart2D) {
         formData.append('plankart2D', this.state.plankart2D);
      }

      if (this.state.plankart3D) {
         formData.append('plankart3D', this.state.plankart3D);
      }

      let data = null;

      try {
         const response = await axios({
            method: 'post',
            url: process.env.REACT_APP_API_BASE_URL + '/filer',
            data: formData,
            headers: {
               'Content-Type': 'multipart/form-data',
               'system': `Arkitektum valideringsklient v/${this.state.username}`
            }
         });

         data = response.data;
      } catch (error) {
         this.setState({
            dialogShow: true,
            dialogMessage: `En feil har oppstått: ${error}`
         });
      } finally {
         this.reset();
         this.props.onValidated(data);
      }
   }

   async showRuleSets(event) {
      event.preventDefault();
      event.stopPropagation();
      
      if (!this.state.ruleSets) {
         await this.getRuleSets();
      }

      this.setState({ ruleSetsShow: true });
   }

   render() {
      return (
         <React.Fragment>
            <Form noValidate validated={this.state.formValidated} onSubmit={this.handleSubmit}>
               <div className="row mb-2">
                  <div className="col-6">
                     <Form.Group controlId="formUsername">
                        <Form.Label>Brukernavn</Form.Label>
                        <Form.Control required type="text" onChange={(evt) => this.setState({ username: evt.target.value })} />
                        <Form.Control.Feedback type="invalid">Vennligst fyll ut brukernavn</Form.Control.Feedback>
                     </Form.Group>
                  </div>
               </div>

               <div className="row">
                  <div className="col">
                     <Form.Group controlId="formUploadOversendelse">
                        <Form.Label>Oversendelse (XML)</Form.Label>
                        <FileInput ref={this.setFileInputRef} accept=".xml" onChange={(files) => this.setState({ oversendelse: files[0] })} />
                     </Form.Group>
                  </div>
                  <div className="col">
                     <Form.Group controlId="formUploadPlanbestemmelser">
                        <Form.Label>Planbestemmelser (XML)</Form.Label>
                        <FileInput ref={this.setFileInputRef} accept=".xml" onChange={(files) => this.setState({ planbestemmelser: files[0] })} />
                     </Form.Group>
                  </div>
               </div>

               <div className="row">
                  <div className="col">
                     <Form.Group controlId="formUploadPlankart2d">
                        <Form.Label>Plankart 2D (GML)</Form.Label>
                        <FileInput ref={this.setFileInputRef} accept=".gml" onChange={(files) => this.setState({ plankart2D: files[0] })} />
                     </Form.Group>
                  </div>
                  <div className="col">
                     <Form.Group controlId="formUploadPlankart2d">
                        <Form.Label>Plankart 3D (GML)</Form.Label>
                        <FileInput ref={this.setFileInputRef} accept=".gml" onChange={(files) => this.setState({ plankart3D: files[0] })} />
                     </Form.Group>
                  </div>
               </div>

               <div className="row mt-2 mb-3">
                  <div className="col">
                     <div className="form-footer">
                        <div>
                           <Button type="submit" disabled={!this.canValidate() || this.state.validating}>Validér</Button>
                           {
                              this.state.validating ?
                                 <div className="spinner-border" role="status">
                                    <span className="sr-only">Loading...</span>
                                 </div> :
                                 ''
                           }
                        </div>

                        <Button variant="link" onClick={this.showRuleSets}>
                           <img className="icon-info" src={InfoIcon} alt="Oversikt over valideringsregler" />Oversikt over valideringsregler
                        </Button>
                     </div>
                  </div>
               </div>
            </Form>

            <RuleSummary ruleSets={this.state.ruleSets} show={this.state.ruleSetsShow} onHide={() => this.setState({ ruleSetsShow: false })} />

            <Dialog title="Validering feilet" message={this.state.dialogMessage} show={this.state.dialogShow} onHide={() => this.setState({ dialogShow: false })} />
         </React.Fragment>
      );
   }
}

export default Upload