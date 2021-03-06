import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FileInput } from 'components/custom-elements';
import { RuleSets } from 'components/partials';
import { sendAsync } from 'utils/api';
import Response from 'components/partials/ValidationResponse/Response/Response';
import { JsonPrint } from 'components/custom-elements';

const VALIDATE_URL = process.env.REACT_APP_PLANOMRISS_VALIDATE_URL;
const RULES_URL = process.env.REACT_APP_PLANOMRISS_RULES_URL;

const ValidatePlanomriss = ({ username }) => {
   const [planomriss, setPlanomriss] = useState(undefined);
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
      formData.append('file', planomriss);     
      const data = await sendAsync(VALIDATE_URL, formData, username);

      reset();

      if (data) {
         setApiResponse(data);
      }
   }
   
   const canValidate = () => {
      return username.trim() !== '' && planomriss !== undefined;
   }

   const reset = () => {
      fileInput.current.reset();
      setPlanomriss(undefined);
      setIsValidating(false);
   }

   return (
      <React.Fragment>
         <div className="paper">
            <Form>
               <div className="row">
                  <div className="col-6">
                     <Form.Group controlId="formUploadPlanomriss">
                        <Form.Label>Planomriss (GML)</Form.Label>
                        <FileInput ref={fileInput} accept=".gml" onChange={files => setPlanomriss(files[0])} />
                     </Form.Group>
                  </div>
               </div>

               <div className="row mt-2 mb-3">
                  <div className="col">
                     <div className="form-footer">
                        <div>
                           <Button onClick={validate} disabled={!canValidate() || isValidating}>Valid??r</Button>
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

export default ValidatePlanomriss