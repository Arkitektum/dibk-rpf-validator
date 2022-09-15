import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { RuleInfo, ValidationResponse } from 'components/partials';
import { sendAsync } from 'utils/api';

const VALIDATE_URL = process.env.REACT_APP_REGULERINGSPLANFORSLAG_VALIDATE_URL;
const RULES_URL = process.env.REACT_APP_REGULERINGSPLANFORSLAG_RULES_URL;

function ValidateReguleringsplanforslag({ username }) {
   const [uploadFiles, setUploadFiles] = useState([]);
   const [apiResponse, setApiResponse] = useState(null);
   const apiLoading = useSelector(state => state.api.loading);
   const fileInputs = [];

   async function validate() {
      if (!canValidate()) {
         return;
      }

      setApiResponse(null);

      const formData = new FormData();
      uploadFiles.forEach(uploadFile => formData.append(uploadFile.name, uploadFile.file));

      const response = await sendAsync(VALIDATE_URL, formData, username);

      if (response) {
         setApiResponse(response);
      }

      reset();
   }

   function canValidate() {
      return username.trim() !== '' && uploadFiles.length > 0;
   }

   function reset() {
      fileInputs.forEach(fileInput => fileInput.reset());
      setUploadFiles([]);
   }

   function setFileInputRef(element) {
      if (element) {
         fileInputs.push(element);
      }
   }

   return (
      <Fragment>
         <div className="rule-info">
            <RuleInfo apiUrl={RULES_URL} rulesetName="Reguleringsplanforslag" username={username} />
         </div>
         
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadOversendelse">
                  <Form.Label>Oversendelse (.xml)</Form.Label>
                  <FileInput name="oversendelse" accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlanbestemmelser">
                  <Form.Label>Planbestemmelser (.xml)</Form.Label>
                  <FileInput name="planbestemmelser" accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlankart2d">
                  <Form.Label>Plankart 2D (.gml)</Form.Label>
                  <FileInput name="plankart2d" accept=".gml" multiple={true} fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlankart2d">
                  <Form.Label>Plankart 3D (.gml)</Form.Label>
                  <FileInput name="plankart3d" accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row mt-2 mb-3">
            <div className="col">
               <div className="form-footer">
                  <div>
                     <Button onClick={validate} disabled={!canValidate() || apiLoading}>Validér</Button>
                     {
                        apiLoading ?
                           <Spinner animation="border" /> :
                           ''
                     }
                  </div>
               </div>
            </div>
         </div>
         {
            apiResponse ?
               <ValidationResponse data={apiResponse} /> :
               null
         }
      </Fragment>
   );
}

export default ValidateReguleringsplanforslag;