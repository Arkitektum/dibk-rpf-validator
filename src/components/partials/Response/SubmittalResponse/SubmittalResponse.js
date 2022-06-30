import IconPassed from '../../../../assets/gfx/icon-passed.svg'
import IconFailed from '../../../../assets/gfx/icon-failed.svg';
import ValidationResponseRow from '../ValidationResponse/ValidationResponseRow/ValidationResponseRow';
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
      <div className="response-container">
         {
            success ?
               <p className="response-text">
                  <img className="icon" src={IconPassed} alt="Passed" />
                  Innsendingen er OK!
               </p> :
               <div className="error-container">
                  <p className="response-text">
                     <img className="icon" src={IconFailed} alt="Failed" />
                     Innsendingen feilet. Vennligst løs alle valideringsfeil og send inn på nytt.
                  </p>

                  <div className="errors">
                     {apiResponse.errors.map((element, index) => <ValidationResponseRow key={'failed-rules-' + index} data={element} />)}
                  </div>
               </div>
         }
      </div>
   );
}

export default SubmittalResponse;