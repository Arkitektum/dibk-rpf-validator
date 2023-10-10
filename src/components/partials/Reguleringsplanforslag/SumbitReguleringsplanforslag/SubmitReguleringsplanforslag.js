import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import { FileInput } from 'components/custom-elements';
import { useAuth } from "react-oidc-context";
import axios from 'axios';
import ReactJson from 'react-json-view';

//const SUBMIT_URL = process.env.REACT_APP_HOERING_OFFENTLIG_ETTERSYN_SUBMIT_URL;


function SumbitReguleringsplanforslag({ username }) {
   const auth = useAuth();
   const [uploadFiles, setUploadFiles] = useState([]);
   const [organisationNumber, setOrganisationNumber] = useState('');
   const [birthNumber, setBirthNumber] = useState('');
   //const [apiResponse, setApiResponse] = useState(null);
   
   const [instanceOwner, setInstanceOwner] = useState('');
   const [instanceURL, setInstanceURL] = useState('');
   const [instanceId, setInstanceId] = useState('');
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
   setInstanceId('');
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
         setInstanceId("");
         reset();
         setInstanceLoading(false);
         return;
      }

      //setApiResponse(null);


      const formData = new FormData();
      const instance = {
         "appId": "dibk/innsending-planforslag",
         "instanceOwner": {
            "personNumber": birthNumber,
            "organisationNumber": organisationNumber
         }
      }
      formData.append("instance", new Blob([JSON.stringify(instance)], {
         type: "application/json"
      }));
      uploadFiles.forEach(uploadFile => {
         if (uploadFile.name === "oversendelseReguleringsplanforslag") {
            var newFileVarsel = new File([uploadFile.file], uploadFile.file.name, { type: "application/xml" })
            formData.append(uploadFile.name, newFileVarsel)
         } else if (uploadFile.name === "plankartGml2d") {
            var newFileOmraade = new File([uploadFile.file], uploadFile.file.name, { type: "application/gml+xml" })
            formData.append(uploadFile.name, newFileOmraade)
         } else if (uploadFile.name === "plankartGml3d") {
            var newFileOmraade3D = new File([uploadFile.file], uploadFile.file.name, { type: "application/gml+xml" })
            formData.append(uploadFile.name, newFileOmraade3D)
         } else {
            formData.append(uploadFile.name, uploadFile.file)
         }
      });
      const defaultOptions = {
         method: 'post',
         "url": "https://dibk.apps.tt02.altinn.no/dibk/innsending-planforslag/instances/",
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
            setInstanceId("");
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
               setInstanceId(instanceResponse.data.id);
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
            setInstanceId("");
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
            setInstanceId("");
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

   function getClickableInstanceUrl(urlToInstance){
      const indexOfFirst = urlToInstance.indexOf("instance");
      var newUrl = urlToInstance.slice(0, indexOfFirst) + "#/" + urlToInstance.slice(indexOfFirst);
      newUrl = newUrl.replace("instances", "instance");
      return newUrl;
   }

   function getHovedInnsendingsNummer(id){
      return id.replace("/", "-");
   }

   return (
      <React.Fragment>
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
               <Form.Group controlId="formUploadOversendelsesbrev">
                  <Form.Label className="required">Oversendelsesbrev (.xml)</Form.Label>
                  <FileInput name="oversendelseReguleringsplanforslag" required accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlanbeskrivelse">
                  <Form.Label className="required">Planbeskrivelse (.pdf, docx)</Form.Label>
                  <FileInput name="planbeskrivelse" accept=".pdf, .docx" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlanbestemmelserXml">
                  <Form.Label className="required">Planbestemmelser (.xml)</Form.Label>
                  <FileInput name="planbestemmelseXml" required accept=".xml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlanbestemmelser">
                  <Form.Label>Planbestemmelser (.pdf, .docx)</Form.Label>
                  <FileInput name="planbestemmelse" required accept=".pdf, docx" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlankartGml2D">
                  <Form.Label className="required">Plankart2D (.gml)</Form.Label>
                  <FileInput name="plankartGml2d" required accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadPlankartGml3D">
                  <Form.Label>Plankart3D (.gml)</Form.Label>
                  <FileInput name="plankartGml3d" required accept=".gml" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadPlankartPdf">
                  <Form.Label>Plankart (.pdf)</Form.Label>
                  <FileInput name="plankartPDF" required accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadAnnet">
                  <Form.Label>Annet (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="annet" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadVarslingsbrev">
                  <Form.Label className="required">Varslingsbrev (.pdf)</Form.Label>
                  <FileInput name="varslingsbrev" required accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadVarslingsliste">
                  <Form.Label className="required">Varslingsliste (.pdf)</Form.Label>
                  <FileInput name="varslingsliste" required accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadSamlefilMottatteUttalelser">
                  <Form.Label>Samlefil av mottatte uttalelser (.pdf)</Form.Label>
                  <FileInput name="samlefilUttalelser" required accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadKommentarTilUttalelser">
                  <Form.Label>Kommentar til uttalelser (.pdf)</Form.Label>
                  <FileInput name="kommentarerUttalelser" required accept=".pdf" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadJuridiskIllustrasjon">
                  <Form.Label>Juridisk illustrasjon (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="juridiskIllustrasjon" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadIllustrasjon">
                  <Form.Label>Illustrasjon (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="illustrasjon" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadROSAnalyse">
                  <Form.Label>ROS-analyse (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="rosAnalyse" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadKonsekvensutredning">
                  <Form.Label className="konsekvensRequired">Konsekvensutredning (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="konsekvensutredning" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
         </div>
         <div className="row">
            <div className="col">
               <Form.Group controlId="formUploadUtredning">
                  <Form.Label>Utredning (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="utredning" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
               </Form.Group>
            </div>
            <div className="col">
               <Form.Group controlId="formUploadRapport">
                  <Form.Label>Rapport (.pdf, .png, .jpg, .jpeg, .tif, .tiff)</Form.Label>
                  <FileInput name="rapport" accept=".pdf, .png, .jpg, .jpeg, .tif, .tiff" fileList={uploadFiles} onChange={setUploadFiles} ref={setFileInputRef} />
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
         {instanceOwner !== "" ? <div>Hovedinnsendingsnummer: {getHovedInnsendingsNummer(instanceId)}</div> : <div></div>}
         {instanceURL !== "" ? <div><a href={getClickableInstanceUrl(instanceURL)} target="_blank" rel="noreferrer">Klikk her for å gå til instance. Du må være logget inn i TT02-miljøet.</a></div> : <div></div>}
         {instanceError !== "" ? <div>{JSON.stringify(instanceError)}</div> : <div></div>}
         {validationResultResponse !== "" ? <ReactJson src={validationResultResponse} /> : <div></div>}
         {/* <SubmittalResponse apiResponse={apiResponse} /> */}
      </React.Fragment>
   );
}

export default SumbitReguleringsplanforslag;