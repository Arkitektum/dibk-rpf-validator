import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { RuleInfo } from 'components/partials';
import Response from 'components/partials/ValidationResponse/Response/Response';
import { JsonPrint } from 'components/custom-elements';
import { sendAsync } from 'utils/api';

const VALIDATE_URL = process.env.REACT_APP_PLANFORSLAG_VALIDATE_URL;
const RULES_URL = process.env.REACT_APP_PLANFORSLAG_RULES_URL;

function ValidatePlanforslag({ username }) {
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
      <React.Fragment>
         <div className="paper">
            <div className="row">
               <div className="col">
                  <Form.Group controlId="formUploadOversendelse">
                     <Form.Label>Oversendelse (XML)</Form.Label>
                     <FileInput name="oversendelse" accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
               <div className="col">
                  <Form.Group controlId="formUploadPlanbestemmelser">
                     <Form.Label>Planbestemmelser (XML)</Form.Label>
                     <FileInput name="planbestemmelser" accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
            </div>

            <div className="row">
               <div className="col">
                  <Form.Group controlId="formUploadPlankart2d">
                     <Form.Label>Plankart 2D (GML)</Form.Label>
                     <FileInput name="plankart2d" accept=".gml" multiple={true} fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
               <div className="col">
                  <Form.Group controlId="formUploadPlankart2d">
                     <Form.Label>Plankart 3D (GML)</Form.Label>
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
                     <RuleInfo apiUrl={RULES_URL} username={username} />
                  </div>
               </div>
            </div>
         </div>

         {
            apiResponse ?
               <div className="paper">
                  <h4>Resultat</h4>
                  <Response data={apiResponse} />
               </div> :
               ''
         }
         {
            apiResponse ?
               <div className="paper">
                  <h4>Svar fra API</h4>
                  <JsonPrint data={apiResponse} />
               </div> :
               ''
         }
      </React.Fragment>
   );
}

export default ValidatePlanforslag;