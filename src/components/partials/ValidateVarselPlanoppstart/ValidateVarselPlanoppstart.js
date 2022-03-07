import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { RuleInfo } from 'components/partials';
import Response from 'components/partials/ValidationResponse/Response/Response';
import { JsonPrint } from 'components/custom-elements';
import { sendAsync } from 'utils/api';

const VALIDATE_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_VALIDATE_URL;
const RULES_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_RULES_URL;

function ValidateVarselPlanoppstart({ username }) {
   const [uploadFiles, setUploadFiles] = useState([]);
   const [apiResponse, setApiResponse] = useState(null);
   const apiLoading = useSelector(state => state.api.loading);
   const fileInput = useRef(null);

   async function validate() {
      if (!canValidate()) {
         return;
      }

      setApiResponse(null);

      const formData = new FormData();
      uploadFiles.forEach(uploadFile => formData.append(uploadFile.name, uploadFile.file));

      const result = await sendAsync(VALIDATE_URL, formData, username);

      if (result) {
         setApiResponse(result);
      }

      reset();
   }

   function canValidate() {
      return username.trim() !== '' && uploadFiles.length > 0;
   }

   function reset() {
     fileInput.current.reset();
     setUploadFiles([]);
   }

   return (
      <React.Fragment>
         <div className="paper">
            <div className="row">
               <div className="col-6">
                  <Form.Group controlId="formUploadVarsel">
                     <Form.Label>Varsel om planoppstart (XML)</Form.Label>
                     <FileInput name="file" accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={fileInput} />
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
               <div className="response">
                  <div className="paper">
                     <h4>Resultat</h4>
                     <Response data={apiResponse} />
                  </div>

                  <div className="paper">
                     <h4>Svar fra API</h4>
                     <JsonPrint data={apiResponse} />
                  </div>
               </div> :
               ''
         }
      </React.Fragment>
   );
}

export default ValidateVarselPlanoppstart;