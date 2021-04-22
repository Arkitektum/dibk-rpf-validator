import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FileInput, SelectDropdown } from 'components/custom-elements';
import { sendAsync } from 'utils/api';
import { saveAs } from 'file-saver';
import './ConvertPlanbestemmelser.scss';

const CONVERT_URL = process.env.REACT_APP_PLANBESTEMMELSER_CONVERT_URL;

const outputOptions = [
   { label: 'HTML', value: `${CONVERT_URL}/html` },
   { label: 'PDF', value: `${CONVERT_URL}/pdf` }
];

let selectedOption = outputOptions[0];

const ConvertPlanbestemmelser = ({ username }) => {
   const [planbestemmelser, setPlanbestemmelser] = useState(undefined);
   const [isConverting, setIsConverting] = useState(false);
   const fileInput = useRef(null);
   
   const convert = async () => {
      if (!canConvert()) {
         return;
      }

      setIsConverting(true);
      const formData = new FormData();
      formData.append('file', planbestemmelser);

      if (selectedOption.label === 'HTML') {
         convertToHtml(formData);
      } else if (selectedOption.label === 'PDF') {
         convertToPdf(formData);
      }
   }

   const convertToHtml = async formData => {
      const data = await sendAsync(selectedOption.value, formData, username);
      reset();

      if (!data) {
         return;
      }

      var tab = window.open('about:blank');
      tab.document.open();
      tab.document.write(data);
      tab.document.close();
   }

   const convertToPdf = async formData => {
      const fileName = formData.get('file').name;
      const data = await sendAsync(selectedOption.value, formData, username, { responseType: 'blob' });
      reset();

      if (!data) {
         return;
      }

      const pdfFileName = fileName.replace(/\.[^/.]+$/, '');
      saveAs(data, `${pdfFileName}.pdf`);
   }

   const canConvert = () => {
      return username.trim() !== '' && planbestemmelser !== undefined;
   }

   const reset = () => {
      fileInput.current.reset();
      setPlanbestemmelser(undefined);
      setIsConverting(false);
   }

   const handleOutputSelect = option => {
      selectedOption = option;
   }

   return (
      <div className="paper">
         <Form>
            <div className="row">
               <div className="col">
                  <Form.Group controlId="formUploadPlanbestemmelser">
                     <Form.Label>Planbestemmelser (XML)</Form.Label>
                     <FileInput ref={fileInput} accept=".xml" onChange={files => setPlanbestemmelser(files[0])} />
                  </Form.Group>
               </div>
               <div className="col">
                  <Form.Group controlId="formSelectOutput">
                     <Form.Label>Utdata</Form.Label>
                     <SelectDropdown name="output" className="selectDropdown" options={outputOptions} value={outputOptions[0]} onSelect={handleOutputSelect} />
                  </Form.Group>
               </div>
            </div>

            <div className="row mt-2 mb-3">
               <div className="col">
                  <div className="form-footer">
                     <div>
                        <Button onClick={convert} disabled={!canConvert() || isConverting}>Konvertér</Button>
                        {
                           isConverting ?
                              <div className="spinner-border" role="status">
                                 <span className="sr-only">Laster...</span>
                              </div> :
                              ''
                        }
                     </div>
                  </div>
               </div>
            </div>
         </Form>
      </div>
   );
}

export default ConvertPlanbestemmelser