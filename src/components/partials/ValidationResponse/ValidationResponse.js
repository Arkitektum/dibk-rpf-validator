import Response from './Response/Response';
import { JsonPrint } from 'components/custom-elements';
import GmlMap from 'components/partials/GmlMap/GmlMap';


const ValidationReponse = ({ apiResponse, gmlDocuments, mapConfig }) => {
   if (!apiResponse || !gmlDocuments.length) {
      return '';
   }

   return (
      <div className="response">
         <div className="paper">
            <h4>Resultat</h4>
            <Response data={apiResponse} />
         </div>

         <div className="paper">
            <h4>Kart</h4>
            <GmlMap gmlDocuments={gmlDocuments} config={mapConfig} />
         </div>

         <div className="paper">
            <h4>Svar fra API</h4>
            <JsonPrint data={apiResponse} />
         </div>
      </div>
   );
}

export default ValidationReponse;