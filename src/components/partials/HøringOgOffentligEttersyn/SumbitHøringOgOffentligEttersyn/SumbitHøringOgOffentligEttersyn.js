import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { SubmittalResponse } from 'components/partials';
import { sendAsync } from 'utils/api';

const SUBMIT_URL = process.env.REACT_APP_HOERING_OFFENTLIG_ETTERSYN_SUBMIT_URL;

const REQUIRED_FILE_TYPES = [
   'Varselbrev',
   'PlankartPdf',
   'PlanbestemmelserPdf'
];

function SumbitHøringOgOffentligEttersyn({ username }) {
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
      return username.trim() !== '' && REQUIRED_FILE_TYPES.every(fileType => uploadFiles.some(uploadFile => uploadFile.name === fileType));
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
                  <Form.Label className="required">Høringsbrev (.xml)</Form.Label>
                  <FileInput name="Varselbrev" required accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlankartGml">
                  <Form.Label>Kart med planavgrensning (.gml)</Form.Label>
                  <FileInput name="PlankartGml" accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlankartPdf">
                  <Form.Label className="required">Kart med planavgrensning (.pdf)</Form.Label>
                  <FileInput name="PlankartPdf" required accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlankartSosi">
                  <Form.Label>Kart med planavgrensning (.sos, .sosi)</Form.Label>
                  <FileInput name="PlankartSosi" accept=".sos, .sosi" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlanbestemmelserPdf">
                  <Form.Label className="required">Planbestemmelser (.pdf)</Form.Label>
                  <FileInput name="PlanbestemmelserPdf" required accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlanbestemmelserXml">
                  <Form.Label>Planbestemmelser (.xml)</Form.Label>
                  <FileInput name="PlanbestemmelserXml" accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlanbeskrivelse">
                  <Form.Label>Planbeskrivelse (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="Planbeskrivelse" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadIllustrasjoner">
                  <Form.Label>Illustrasjoner (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="Illustrasjoner" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadROSAnalyse">
                  <Form.Label>ROS-analyse (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="ROSAnalyse" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadKonsekvensutredning">
                  <Form.Label>Konsekvensutredning (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="Konsekvensutredning" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col-6">
               <Form.Group controlId="formUploadAnnet">
                  <Form.Label>Annet (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="Annet" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
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

export default SumbitHøringOgOffentligEttersyn;