import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { sendAsync } from 'utils/api';
import SubmittalResponse from '../SubmittalResponse/SubmittalResponse';

const SUBMIT_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_SUBMIT_URL;

function SubmitVarselPlanoppstart({ username }) {
   const [uploadFiles, setUploadFiles] = useState([]);
   const [apiResponse, setApiResponse] = useState(null);
   const apiLoading = useSelector(state => state.api.loading);
   const fileInputs = [];

   async function submit() {
      if (!canSubmit()) {
         return;
      }

      setApiResponse(null);

      const formData = new FormData();
      uploadFiles.forEach(uploadFile => formData.append(uploadFile.name, uploadFile.file));

      const response = await sendAsync(SUBMIT_URL, formData, username);

      if (response) {
         setApiResponse(response);
      }

      reset();
   }

   function canSubmit() {
      return username.trim() !== '' && uploadFiles.some(uploadFile => uploadFile.name === 'varselbrev');
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
                  <Form.Group controlId="formUploadVarselbrev">
                     <Form.Label className="required">Varselbrev (XML)</Form.Label>
                     <FileInput name="varselbrev" required accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
               <div className="col">
                  <Form.Group controlId="formUploadPlangrenseGml">
                     <Form.Label>Planområde (GML)</Form.Label>
                     <FileInput name="planomraade" accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
            </div>

            <div className="row">
               <div className="col">
                  <Form.Group controlId="formUploadPlangrensePdf">
                     <Form.Label>Planområde (PDF)</Form.Label>
                     <FileInput name="planomraadePdf" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
               <div className="col">
                  <Form.Group controlId="formUploadKartDetaljert">
                     <Form.Label>Detaljert kart (PDF)</Form.Label>
                     <FileInput name="kartDetaljert" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
            </div>

            <div className="row">
               <div className="col">
                  <Form.Group controlId="formUploadPlaninitiativ">
                     <Form.Label>Planinitiativ (PDF)</Form.Label>
                     <FileInput name="planinitiativ" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
               <div className="col">
                  <Form.Group controlId="formUploadPlanprogram">
                     <Form.Label>Planprogram (PDF)</Form.Label>
                     <FileInput name="planprogram" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
            </div>

            <div className="row">
               <div className="col">
                  <Form.Group controlId="formUploadReferatOppstartsmøte">
                     <Form.Label>Referat fra oppstartsmøte (PDF)</Form.Label>
                     <FileInput name="referatOppstartsmoete" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
               <div className="col">
                  <Form.Group controlId="formUploadAnnet">
                     <Form.Label>Annet (PDF)</Form.Label>
                     <FileInput name="annet" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
                  </Form.Group>
               </div>
            </div>

            <div className="row mb-3">
               <div className="col">
                  Felter markert med en rød stjerne (<span className="required">*</span>) er obligatoriske
               </div>
            </div>            

            <div className="row mt-2 mb-3">
               <div className="col">
                  <div className="form-footer">
                     <div>
                        <Button onClick={submit} disabled={!canSubmit() || apiLoading}>Send inn</Button>
                        {
                           apiLoading ?
                              <Spinner animation="border" /> :
                              ''
                        }
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <SubmittalResponse apiResponse={apiResponse} />
      </React.Fragment>
   );
}

export default SubmitVarselPlanoppstart;