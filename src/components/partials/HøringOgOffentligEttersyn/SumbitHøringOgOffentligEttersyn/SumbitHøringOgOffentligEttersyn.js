import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { SubmittalResponse } from 'components/partials';
import { sendAsync } from 'utils/api';
import { useAuth } from "react-oidc-context";
import axios from 'axios';
import ReactJson from 'react-json-view';

//const SUBMIT_URL = process.env.REACT_APP_HOERING_OFFENTLIG_ETTERSYN_SUBMIT_URL;

const REQUIRED_FILE_TYPES = [
   'Varselbrev',
   'PlanbestemmelserPdf'
];

function SumbitHøringOgOffentligEttersyn({ username }) {
   const auth = useAuth();
   const [uploadFiles, setUploadFiles] = useState([]);
   const [organisationNumber, setOrganisationNumber] = useState('');
   const [birthNumber, setBirthNumber] = useState('');
   //const [apiResponse, setApiResponse] = useState(null);
   
   const [instanceOwner, setInstanceOwner] = useState('');
   const [instanceURL, setInstanceURL] = useState('');
   const [instanceError, setInstanceError] = useState('');
   const [validationResultResponse, setValidationResultResponse] = useState('');
   const [instanceLoading, setInstanceLoading] = useState(false);


   //const apiLoading = useSelector(state => state.api.loading);
   const fileInputs = [];

   /* eslint-disable */
   useEffect(() => {
      if (!auth.isAuthenticated && auth.user?.expired) {
         auth.signinSilent();
      }
   }, [auth.isAuthenticated])
/* eslint-enable */

function clearInstanceData(){
   setInstanceError("");
   setInstanceURL("");
   setInstanceOwner("");
   setValidationResultResponse("");
}

   async function submit() {
      setInstanceLoading(true);
      clearInstanceData();

      const token = await ExchangeAltinnToken();

      if (token == null) {
         setInstanceError({ errorMessage: "Problemer med Altinn Exchange av ID-porten-token." });
         setInstanceURL("");
         setInstanceOwner("");
         reset();
         setInstanceLoading(false);
         return;
      }

      //setApiResponse(null);


      const formData = new FormData();
      const instance = {
         "appId": "dibk/varselplanoppstart",
         "instanceOwner": {
            "personNumber": birthNumber,
            "organisationNumber": organisationNumber
         }
      }
      formData.append("instance", new Blob([JSON.stringify(instance)], {
         type: "application/json"
      }));
      uploadFiles.forEach(uploadFile => {
         if (uploadFile.name === "offentligEttersyn") {
            var newFileVarsel = new File([uploadFile.file], uploadFile.file.name, { type: "application/xml" })
            formData.append(uploadFile.name, newFileVarsel)
         } else if (uploadFile.name === "PlankartGml") {
            var newFileOmraade = new File([uploadFile.file], uploadFile.file.name, { type: "application/gml+xml" })
            formData.append(uploadFile.name, newFileOmraade)
         } else {
            formData.append(uploadFile.name, uploadFile.file)
         }
      });
      const defaultOptions = {
         method: 'post',
         "url": "https://dibk.apps.tt02.altinn.no/dibk/varsel-hoffe/instances/",
         "data": formData,
         headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer " + token
         }
      };

      var response = await axios(Object.assign(defaultOptions))
         .then(res => {
            if (res.status !== 200 && res.status !== 201) {
               return res.text().then(text => { throw new Error(text) })
            }
            return res;
         })
         .catch(err => {
            setInstanceError(err.response.data);
            setInstanceURL("");
            setInstanceOwner("");
         })
      // try {
      //    response = await axios(Object.assign(defaultOptions));
      //    if (response.status == 200 || response.status == 201) {
      //       console.log(response);
      //       setInstanceOwner(response.data.instanceOwner);
      //       setInstanceURL(response.data.selfLinks.apps);
      //       setApiResponse(response);
      //    } else {
      //       setInstanceError(response);
      //       reset();
      //       setInstanceLoading(false);
      //    }
      // } catch (exception) {
      //    setInstanceError(response);
      //    reset();
      //    setInstanceLoading(false);
      //    return;
      // }
      await triggerNextStepOnInstance(response);
      setInstanceLoading(false);
      reset();
   }
   async function triggerNextStepOnInstance(instanceResponse) {
      const nextProxessUrl = instanceResponse.data.selfLinks.apps + "/process/next";

      const token = await ExchangeAltinnToken();

      const defaultOptions = {
         method: 'put',
         "url": nextProxessUrl,
         headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer " + token
         }
      };

      let nextStepOk = false;

      await axios(Object.assign(defaultOptions))
         .then(res => {
            if (res.status === 200 || res.status === 201) {
               setInstanceOwner(instanceResponse.data.instanceOwner);
               setInstanceURL(instanceResponse.data.selfLinks.apps);
               //setApiResponse(res);

               //setApiResponse(res);
               nextStepOk = true
            }
            else {
               return res.text().then(text => { throw new Error(text) })
            }
         })
         .catch(err => {
            setInstanceError(err.response.data);
            setInstanceURL("");
            setInstanceOwner("");
         })
      if (!nextStepOk) {
         await callValidateEndpoint(instanceResponse);
      }
   }

   async function callValidateEndpoint(response) {
      const validateUrl = response.data.selfLinks.apps + "/validate";

      const token = await ExchangeAltinnToken();

      const defaultOptions = {
         method: 'get',
         "url": validateUrl,
         headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': "Bearer " + token
         }
      };

      await axios(Object.assign(defaultOptions))
         .then(res => {
            if (res.status === 200 || res.status === 201) {
               setInstanceURL(response.data.selfLinks.apps);
               setValidationResultResponse(res.data);
               //setApiResponse(res);
            }
            else {
               return res.text().then(text => { throw new Error(text) })
            }
         })
         .catch(err => {
            setInstanceError(err.response.data);
            setInstanceURL("");
            setInstanceOwner("");
         })

   }


   // function canSubmit() {
   //    return username.trim() !== '' && REQUIRED_FILE_TYPES.every(fileType => uploadFiles.some(uploadFile => uploadFile.name === fileType));
   // }

   function reset() {
      fileInputs.forEach(fileInput => fileInput.reset());
      setUploadFiles([]);
      setBirthNumber("");
      setOrganisationNumber("");
   }

   function setFileInputRef(element) {
      if (element) {
         fileInputs.push(element);
      }
   }

   async function ExchangeAltinnToken() {

      const idPortenTokenBearer = auth.user?.access_token;
      const bearerPayload = {
         "idPortenToken": idPortenTokenBearer
      };
      let altinnToken = null;
      try {
         altinnToken = await AltinnExchangeCall(bearerPayload);

         if (altinnToken == null) {
            try {
               const newBearer = {
                  "idPortenToken": auth.user?.access_token
               };
               altinnToken = await AltinnExchangeCall(newBearer);
            } catch (exception) {
               throw exception;
            }
         } else {
            return altinnToken;
         }
      } catch {
         return null;
      }
   }

   async function AltinnExchangeCall(bearerPayload) {
      try {
         const response = await fetch("https://dibk.apps.tt02.altinn.no/dibk/varselplanoppstart/exchangealtinntoken", {
            method: "post",
            body: JSON.stringify(bearerPayload),
            headers: {
               'Content-Type': 'application/json',
            }
         });
         let altinnToken = null;

         if (response.status === 200 || response.status === 201) {
            await response.text().then(function (data) {
               altinnToken = data;
            });
         }
         return altinnToken;
      } catch (e) {
         return null;
      }
   }

   return (
      <React.Fragment>
         <div className="row">
            <div className="col" hidden={auth.isAuthenticated}><h4>Logg inn med ID-porten i menyen til venstre for å sende inn Varsel om planoppstart</h4></div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Label >Organisasjonsnummer</Form.Label>
               <Form.Control
               style={{marginBottom: "16px"}}
                  type="text"
                  value={organisationNumber}
                  required
                  placeholder="Organisasjonsnummer"
                  onChange={event => setOrganisationNumber(event.target.value)}
               />
            </div>
            <div className="col">
               <Form.Label >Personnummer</Form.Label>
               <Form.Control
                  type="text"
                  value={birthNumber}
                  required
                  placeholder="Personnummer"
                  onChange={event => { setBirthNumber(event.target.value) }}
               />
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadVarselbrev">
                  <Form.Label className="required">Høringsbrev (.xml)</Form.Label>
                  <FileInput name="offentligEttersyn" required accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlankartGml">
                  <Form.Label className="partlyRequired">Kart med planavgrensning (.gml)</Form.Label>
                  <FileInput name="PlankartGml" accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlankartPdf">
                  <Form.Label className="partlyRequired">Kart med planavgrensning (.pdf)</Form.Label>
                  <FileInput name="PlankartPdf" required accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlankartSosi">
                  <Form.Label className="partlyRequired">Kart med planavgrensning (.sos, .sosi)</Form.Label>
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
               <span className="required">*</span> = Feltet er obligatorisk
            </div>
         </div>
         <div className="row mb-3">
            <div className="col">
               <span className="required">**</span> = Minst et av feltene må fylles ut
            </div>
         </div>

         <div className="row mb-3">
            <div className="col">
               <h5>Husk å skriv inn organisasjonsnummer og/eller personnummer</h5>
            </div>
         </div>

         <div className="row mt-2 mb-3">
            <div className="col">
               <div className="form-footer">
                  <div>
                     {!instanceLoading ?
                        <Button onClick={submit} disabled={!auth.isAuthenticated}>Send inn</Button> :
                        <div><Spinner animation="border" /> <p>...Sender inn filer til Altinn...</p></div>
                     }
                  </div>
                  <div className="col" hidden={auth.isAuthenticated}>Logg inn med ID-porten i menyen til venstre for å sende inn Varsel om planoppstart</div>
               </div>
            </div>
         </div>
         {instanceOwner !== "" ? <div>{JSON.stringify(instanceOwner)}</div> : <div></div>}
         {instanceURL !== "" ? <div>{JSON.stringify(instanceURL)}</div> : <div></div>}
         {instanceError !== "" ? <div>{JSON.stringify(instanceError)}</div> : <div></div>}
         {validationResultResponse !== "" ? <ReactJson src={validationResultResponse} /> : <div></div>}
         {/* <SubmittalResponse apiResponse={apiResponse} /> */}
      </React.Fragment>
   );
}

export default SumbitHøringOgOffentligEttersyn;