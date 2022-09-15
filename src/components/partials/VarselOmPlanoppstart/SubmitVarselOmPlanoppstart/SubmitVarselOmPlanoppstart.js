import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { SubmittalResponse } from 'components/partials';
import { sendAsync } from 'utils/api';

const SUBMIT_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_SUBMIT_URL;

function SubmitVarselOmPlanoppstart({ username }) {
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
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadVarselbrev">
                  <Form.Label className="required">Varselbrev (.xml)</Form.Label>
                  <FileInput name="varselbrev" required accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlangrenseGml">
                  <Form.Label>Planområde (.gml)</Form.Label>
                  <FileInput name="planomraade" accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlangrenseSosi">
                  <Form.Label>Planområde (.sos, .sosi)</Form.Label>
                  <FileInput name="planomraadeSosi" accept=".sos, .sosi" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlangrensePdf">
                  <Form.Label>Planområde (.pdf)</Form.Label>
                  <FileInput name="planomraadePdf" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadKartDetaljert">
                  <Form.Label>Detaljert kart (.pdf)</Form.Label>
                  <FileInput name="kartDetaljert" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlaninitiativ">
                  <Form.Label>Planinitiativ (.pdf)</Form.Label>
                  <FileInput name="planinitiativ" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlanprogram">
                  <Form.Label>Planprogram (.pdf)</Form.Label>
                  <FileInput name="planprogram" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadReferatOppstartsmøte">
                  <Form.Label>Referat fra oppstartsmøte (.pdf)</Form.Label>
                  <FileInput name="referatOppstartsmoete" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col-6">
               <Form.Group controlId="formUploadAnnet">
                  <Form.Label>Annet (.pdf)</Form.Label>
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

         <SubmittalResponse apiResponse={apiResponse} />
      </React.Fragment>
   );
}

export default SubmitVarselOmPlanoppstart;