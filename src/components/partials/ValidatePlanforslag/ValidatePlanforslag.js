import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FileInput } from 'components/custom-elements';
import { RuleSets } from 'components/partials';
import Response from 'components/partials/ValidationResponse/Response/Response';
import { JsonPrint } from 'components/custom-elements';
import GmlMap from 'components/partials/GmlMap/GmlMap';
import { sendAsync } from 'utils/api';
import config from 'config/map.plankart.config';
import { getValidGmlDocuments } from 'utils/helpers';

const VALIDATE_URL = process.env.REACT_APP_PLANFORSLAG_VALIDATE_URL;
const RULES_URL = process.env.REACT_APP_PLANFORSLAG_RULES_URL;

const ValidatePlanforslag = ({ username }) => {
   const [oversendelse, setOversendelse] = useState(undefined);
   const [planbestemmelser, setPlanbestemmelser] = useState(undefined);
   const [plankart2D, setPlankart2D] = useState([]);
   const [plankart3D, setPlankart3D] = useState(undefined);
   const [isValidating, setIsValidating] = useState(false);
   const [apiResponse, setApiResponse] = useState(null);
   const [gmlDocuments, setGmlDocuments] = useState([]);
   const fileInputs = [];

   const validate = async () => {
      if (!canValidate()) {
         return;
      }

      setIsValidating(true);
      setApiResponse(null);
      setGmlDocuments([]);

      const result = await sendAsync(VALIDATE_URL, getFormData(), username);

      if (result) {
         const gmlDocs = await getValidGmlDocuments(plankart2D, result, config.validationRuleIds);
         setGmlDocuments(gmlDocs);
         setApiResponse(result);
      }

      reset();
   }

   const canValidate = () => {
      return username.trim() !== '' && !(!oversendelse && !planbestemmelser && !plankart2D.length && !plankart3D);
   }

   const getFormData = () => {
      const formData = new FormData();

      if (oversendelse) {
         formData.append('oversendelse', oversendelse);
      }

      if (planbestemmelser) {
         formData.append('planbestemmelser', planbestemmelser);
      }

      if (plankart2D.length) {
         plankart2D.forEach(plankart => formData.append('plankart2D', plankart));
      }

      if (plankart3D) {
         formData.append('plankart3D', plankart3D);
      }

      return formData;
   }

   const reset = () => {
      fileInputs.forEach(fileInput => fileInput.reset());
      setOversendelse(undefined);
      setPlanbestemmelser(undefined);
      setPlankart2D([]);
      setPlankart3D(undefined);
      setIsValidating(false);
   }

   const setFileInputRef = element => {
      if (element) {
         fileInputs.push(element);
      }
   }

   return (
      <React.Fragment>
         <div className="paper">
            <Form>
               <div className="row">
                  <div className="col">
                     <Form.Group controlId="formUploadOversendelse">
                        <Form.Label>Oversendelse (XML)</Form.Label>
                        <FileInput ref={setFileInputRef} accept=".xml" onChange={files => setOversendelse(files[0])} />
                     </Form.Group>
                  </div>
                  <div className="col">
                     <Form.Group controlId="formUploadPlanbestemmelser">
                        <Form.Label>Planbestemmelser (XML)</Form.Label>
                        <FileInput ref={setFileInputRef} accept=".xml" onChange={files => setPlanbestemmelser(files[0])} />
                     </Form.Group>
                  </div>
               </div>

               <div className="row">
                  <div className="col">
                     <Form.Group controlId="formUploadPlankart2d">
                        <Form.Label>Plankart 2D (GML)</Form.Label>
                        <FileInput ref={setFileInputRef} accept=".gml" multiple={true} onChange={files => setPlankart2D(files)} />
                     </Form.Group>
                  </div>
                  <div className="col">
                     <Form.Group controlId="formUploadPlankart2d">
                        <Form.Label>Plankart 3D (GML)</Form.Label>
                        <FileInput ref={setFileInputRef} accept=".gml" onChange={files => setPlankart3D(files[0])} />
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
               <div className="paper">
                  <h4>Resultat</h4>
                  <Response data={apiResponse} />
               </div> :
               ''
         }
         {
            gmlDocuments.length ?
               <div className="paper">
                  <h4>Kart</h4>
                  <GmlMap gmlDocuments={gmlDocuments} config={config} />
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

export default ValidatePlanforslag