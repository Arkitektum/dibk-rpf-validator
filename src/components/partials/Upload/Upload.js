import React, { Component } from 'react';
import { connect } from 'react-redux';
import { showDialog } from 'store/slices/dialogSlice';
import { FileInput } from 'components/custom-elements';
import { RuleSets } from 'components/partials';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
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
         dialogMessage: ''
      };

      this.validate = this.validate.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
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
         this.props.dispatch(showDialog({ title: 'En feil har oppstått', message: error.message }));
      } finally {
         this.reset();
         this.props.onValidated(data);
      }
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
                        <RuleSets  />                        
                     </div>
                  </div>
               </div>
            </Form>
         </React.Fragment>
      );
   }
}

export default connect(state => state.dialog)(Upload);
