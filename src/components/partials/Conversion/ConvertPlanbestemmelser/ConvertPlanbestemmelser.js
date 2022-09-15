import React, { useState, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FileInput, SelectDropdown } from 'components/custom-elements';
import { sendAsync } from 'utils/api';
import { saveAs } from 'file-saver';
import { Spinner } from 'react-bootstrap';
import './ConvertPlanbestemmelser.scss';

const CONVERT_URL = process.env.REACT_APP_PLANBESTEMMELSER_CONVERT_URL;

const OUTPUT_OPTIONS = [
   { label: 'HTML', value: `${CONVERT_URL}/html` },
   { label: 'PDF', value: `${CONVERT_URL}/pdf` }
];

let selectedOption = OUTPUT_OPTIONS[0];

function ConvertPlanbestemmelser({ username }) {
   const [uploadFiles, setUploadFiles] = useState([]);
   const apiLoading = useSelector(state => state.api.loading);
   const fileInput = useRef(null);

   async function convert() {
      if (!canConvert()) {
         return;
      }

      const formData = new FormData();
      uploadFiles.forEach(uploadFile => formData.append(uploadFile.name, uploadFile.file));

      if (selectedOption.label === 'HTML') {
         convertToHtml(formData);
      } else if (selectedOption.label === 'PDF') {
         convertToPdf(formData);
      }
   }

   async function convertToHtml(formData) {
      const response = await sendAsync(selectedOption.value, formData, username);
      reset();

      if (!response) {
         return;
      }

      var tab = window.open('about:blank');
      tab.document.open();
      tab.document.write(response);
      tab.document.close();
   }

   async function convertToPdf(formData) {
      const fileName = formData.get('file').name;
      const response = await sendAsync(selectedOption.value, formData, username, { responseType: 'blob' });
      reset();

      if (!response) {
         return;
      }

      const pdfFileName = fileName.replace(/\.[^/.]+$/, '');
      saveAs(response, `${pdfFileName}.pdf`);
   }

   function canConvert() {
      return username.trim() !== '' && uploadFiles.length > 0;
   }

   function reset() {
      fileInput.current.reset();
      setUploadFiles([]);
   }

   function handleOutputSelect(option) {
      selectedOption = option;
   }

   return (
      <Fragment>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlanbestemmelser">
                  <Form.Label>Planbestemmelser (.xml)</Form.Label>
                  <FileInput name="file" accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={fileInput} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formSelectOutput">
                  <Form.Label>Utdata</Form.Label>
                  <SelectDropdown name="output" className="selectDropdown" options={OUTPUT_OPTIONS} value={OUTPUT_OPTIONS[0]} onSelect={handleOutputSelect} />
               </Form.Group>
            </div>
         </div>

         <div className="row mt-2 mb-3">
            <div className="col">
               <div className="form-footer">
                  <div>
                     <Button onClick={convert} disabled={!canConvert() || apiLoading}>Konvertér</Button>
                     {
                        apiLoading ?
                           <Spinner animation="border" /> :
                           null
                     }
                  </div>
               </div>
            </div>
         </div>
      </Fragment>
   );
}

export default ConvertPlanbestemmelser;