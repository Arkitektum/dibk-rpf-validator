import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FileInput } from 'components/custom-elements';
import { sendAsync } from 'utils/api';
import { saveAs } from 'file-saver';
import { Spinner } from 'react-bootstrap';

const GML2SOSI_URL = process.env.REACT_APP_GML2SOSI_URL;

function Gml2Sosi() {
   const [uploadFiles, setUploadFiles] = useState([]);
   const apiLoading = useSelector(state => state.api.loading);
   const fileInput = useRef(null);

   async function convert() {
      if (!canConvert()) {
         return;
      }

      const formData = new FormData();
      const fileName = uploadFiles[0].file.name;
      formData.append('gmlFile', uploadFiles[0].file);

      const response = await sendAsync(GML2SOSI_URL, formData, null, { responseType: 'blob' });
      reset();

      if (!response) {
         return;
      }

      const sosiFileName = fileName.replace(/\.[^/.]+$/, '');
      saveAs(response, `${sosiFileName}.sos`);
   }

   function canConvert() {
      return uploadFiles.length > 0;
   }

   function reset() {
      fileInput.current.reset();
      setUploadFiles([]);
   }

   return (
      <div className="paper">
         <div className="row">
            <div className="col-6">
               <Form.Group controlId="formGml2Sosi">
                  <Form.Label>Plankart (GML)</Form.Label>
                  <FileInput name="gmlFile" accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={fileInput} multiple={false} />
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
                           ''
                     }
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Gml2Sosi;