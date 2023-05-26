import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { useAuth } from "react-oidc-context";
import axios from 'axios';
import ReactJson from 'react-json-view'

//const SUBMIT_URL = process.env.REACT_APP_VARSEL_PLANOPPSTART_SUBMIT_URL;

function SubmitVarselOmPlanoppstart({ username }) {
   const auth = useAuth();

   const [uploadFiles, setUploadFiles] = useState([]);
   const [apiResponse, setApiResponse] = useState(null);
   const [organisationNumber, setOrganisationNumber] = useState('');
   const [birthNumber, setBirthNumber] = useState('');

   const [instanceOwner, setInstanceOwner] = useState('');
   const [instanceURL, setInstanceURL] = useState('');
   const [instanceError, setInstanceError] = useState('');
   const [validationResultResponse, setValidationResultResponse] = useState('');


   const [instanceLoading, setInstanceLoading] = useState(false);


   //const apiLoading = useSelector(state => state.api.loading);
   const fileInputs = [];

   useEffect(() => {
      if (!auth.isAuthenticated && auth.user?.expired) {
         auth.signinSilent();
      }
   }, [auth.isAuthenticated])

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

      setApiResponse(null);


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
         if (uploadFile.name === "planvarselHoeringsmyndigheter") {
            var newFileVarsel = new File([uploadFile.file], uploadFile.file.name, { type: "application/xml" })
            formData.append(uploadFile.name, newFileVarsel)
         } else if (uploadFile.name === "Planomraade") {
            var newFileOmraade = new File([uploadFile.file], uploadFile.file.name, { type: "application/gml+xml" })
            formData.append(uploadFile.name, newFileOmraade)
         } else {
            formData.append(uploadFile.name, uploadFile.file)
         }
      });


      const defaultOptions = {
         method: 'post',
         "url": "https://dibk.apps.tt02.altinn.no/dibk/varselplanoppstart/instances/",
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
               setApiResponse(res);

               setApiResponse(res);
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
               setApiResponse(res);
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

      // const defaultOptions = {
      //    method: 'get',
      //    "url": "https://platform.tt02.altinn.no/authentication/api/v1/exchange/id-porten",
      //    withCredentials: true,
      //    headers: {
      //       'Authorization': idPortenTokenBearer,
      //    }
      // };
      // const response = await axios(Object.assign(defaultOptions));
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

   function canSubmit() {
      return uploadFiles.some(uploadFile => uploadFile.name === 'varselbrev');
   }

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

   return (
      <React.Fragment>

         <div className="row">
            <div className="col" hidden={auth.isAuthenticated}><h4>Logg inn med ID-porten i menyen til venstre for å sende inn Varsel om planoppstart</h4></div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Label >Organisasjonsnummer</Form.Label>
               <Form.Control
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
                  <Form.Label >Varselbrev (.xml)</Form.Label>
                  <FileInput name="planvarselHoeringsmyndigheter" required accept="application/xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlangrenseGml">
                  <Form.Label>Planområde (.gml)</Form.Label>
                  <FileInput name="Planomraade" accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlangrenseSosi">
                  <Form.Label>Planområde (.sos, .sosi)</Form.Label>
                  <FileInput name="PlanomraadeSosi" accept=".sos, .sosi" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlangrensePdf">
                  <Form.Label>Planområde (.pdf)</Form.Label>
                  <FileInput name="PlanomraadePdf" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadKartDetaljert">
                  <Form.Label>Detaljert kart (.pdf)</Form.Label>
                  <FileInput name="KartDetaljert" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlaninitiativ">
                  <Form.Label>Planinitiativ (.pdf)</Form.Label>
                  <FileInput name="Planinitiativ" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlanprogram">
                  <Form.Label>Planprogram (.pdf)</Form.Label>
                  <FileInput name="Planprogram" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadReferatOppstartsmøte">
                  <Form.Label>Referat fra oppstartsmøte (.pdf)</Form.Label>
                  <FileInput name="ReferatOppstartsmoete" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>

         <div className="row">
            <div className="col-6">
               <Form.Group controlId="formUploadAnnet">
                  <Form.Label>Annet (.pdf)</Form.Label>
                  <FileInput name="Annet" accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
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

export default SubmitVarselOmPlanoppstart;