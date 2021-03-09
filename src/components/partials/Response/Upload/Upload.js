import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FileInput from 'components/custom-elements/FileInput/FileInput';
import axios from 'axios';
import './Upload.scss';

class Upload extends Component {
   constructor(props) {
      super(props);

      this.state = {
         validating: false,
         oversendelse: undefined,
         planbestemmelser: undefined,
         plankart2D: undefined,
         plankart3D: undefined
      };

      this.validate = this.validate.bind(this);
      this.fileInputs = [];

      this.setFileInputRef = element => {
         this.fileInputs.push(element);
      };
   }

   hasFiles() {
      return this.state.oversendelse !== undefined ||
         this.state.planbestemmelser !== undefined ||
         this.state.plankart2D !== undefined ||
         this.state.plankart3D !== undefined;
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
      if (!this.hasFiles()) {
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
            url: process.env.REACT_APP_API_BASE_URL,
            data: formData,
            headers: {
               'Content-Type': 'multipart/form-data',
               'System': 'validation-client'
            }
         });

         data = response.data;
      } catch (error) {
         alert(`En feil har oppstått: ${error}`);
      } finally {
         this.reset();
         this.props.onValidated(data);
      }
   }

   render() {
      return (
         <React.Fragment>
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

            <div className="row mt-2">
               <div className="col">
                  <Button onClick={this.validate} disabled={!this.hasFiles() || this.state.validating}>Validér</Button>

                  {
                     this.state.validating ?
                        <div className="spinner-border" role="status">
                           <span className="sr-only">Loading...</span>
                        </div> :
                        ''
                  }
               </div>
            </div>
         </React.Fragment>
      );
   }
}

export default Upload