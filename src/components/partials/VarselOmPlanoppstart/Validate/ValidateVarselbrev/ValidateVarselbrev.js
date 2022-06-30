import React, { useState, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Button, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { sendAsync } from 'utils/api';
import { RuleInfo, ValidationResponse } from 'components/partials';

const VALIDATE_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_VALIDATE_URL;
const RULESET_API_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_RULES_URL;

function ValidateVarselbrev({ username }) {
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
      <Fragment>
         <div className="row mb-3">
            <div className="col">
               <RuleInfo apiUrl={RULESET_API_URL} rulesetName="Varsel om planoppstart - Varselbrev" username={username} />
            </div>
         </div>

         <div className="row mb-4">
            <div className="col-6">
               <FileInput name="file" accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={fileInput} />
            </div>
         </div>

         <div className="row mb-3">
            <div className="col">
               <div className="form-footer">
                  <div>
                     <Button onClick={validate} disabled={!canValidate() || apiLoading}>Validér</Button>
                     {
                        apiLoading ?
                           <Spinner animation="border" /> :
                           null
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

export default ValidateVarselbrev;