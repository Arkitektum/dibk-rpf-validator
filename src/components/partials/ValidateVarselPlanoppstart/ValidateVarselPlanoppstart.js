import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FileInput } from 'components/custom-elements';
import { RuleSets } from 'components/partials';
import Response from 'components/partials/ValidationResponse/Response/Response';
import { JsonPrint } from 'components/custom-elements';
import { sendAsync } from 'utils/api';

const VALIDATE_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_VALIDATE_URL;
const RULES_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_RULES_URL;

const ValidateVarselPlanoppstart = ({ username }) => {
   const [varsel, setVarsel] = useState(undefined);
   const [isValidating, setIsValidating] = useState(false);
   const [apiResponse, setApiResponse] = useState(null);
   const fileInput = useRef(null);

   const validate = async () => {
      if (!canValidate()) {
         return;
      }

      setIsValidating(true);
      setApiResponse(null);

      const formData = new FormData();
      formData.append('file', varsel);     
      const data = await sendAsync(VALIDATE_URL, formData, username);

      reset();

      if (data) {
         setApiResponse(data);
      }
   }
   
   const canValidate = () => {
      return username.trim() !== '' && varsel !== undefined;
   }

   const reset = () => {
      fileInput.current.reset();
      setVarsel(undefined);
      setIsValidating(false);
   }

   return (
      <React.Fragment>
         <div className="paper">
            <Form>
               <div className="row">
                  <div className="col-6">
                     <Form.Group controlId="formUploadVarsel">
                        <Form.Label>Varsel om planoppstart (XML)</Form.Label>
                        <FileInput ref={fileInput} accept=".xml" onChange={files => setVarsel(files[0])} />
                     </Form.Group>
                  </div>
               </div>

               <div className="row mt-2 mb-3">
                  <div className="col">
                     <div className="form-footer">
                        <div>
                           <Button onClick={validate} disabled={!canValidate() || isValidating}>Validér</Button>
                           {
                              isValidating ?
                                 <div className="spinner-border" role="status">
                                    <span className="sr-only">Laster...</span>
                                 </div> :
                                 ''
                           }
                        </div>
                        <RuleSets apiUrl={RULES_URL} username={username} />
                     </div>
                  </div>
               </div>
            </Form>
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

export default ValidateVarselPlanoppstart