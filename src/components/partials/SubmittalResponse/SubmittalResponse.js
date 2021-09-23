import ResponseBlock from '../ValidationResponse/ResponseBlock/ResponseBlock';
import IconPassed from '../../../assets/gfx/icon-passed.svg';
import IconFailed from '../../../assets/gfx/icon-failed.svg';
import './SubmittalResponse.scss';

function SubmittalResponse({ apiResponse }) {
   if (!apiResponse) {
      return null;
   }

   const success = apiResponse.errors.length === 0;

   if (success) {
      console.table(apiResponse.containerReference);
   }

   return (
      <div className="paper">
         <h4>Resultat</h4>

         {
            success ?
               <p className="response-text">
                  <img className="icon" src={IconPassed} alt="Passed" />
                  Innsendingen er OK!
               </p> :
               <div>
                  <p className="response-text">
                     <img className="icon" src={IconFailed} alt="Failed" />
                     Innsendingen feilet. Vennligst løs alle valideringsfeil og send inn på nytt.
                  </p>
                  <ResponseBlock list={apiResponse.errors} title="Valideringsfeil" expandable={false} maxHeight={false} />
               </div>
         }
      </div>
   );
}

export default SubmittalResponse;