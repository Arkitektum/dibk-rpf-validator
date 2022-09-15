import { Fragment, useState } from 'react';
import { SelectDropdown } from 'components/custom-elements';
import ValidateVarselbrev from './ValidateVarselbrev/ValidateVarselbrev';
import ValidatePlanområde from './ValidatePlanområde/ValidatePlanområde';
import './Validate.scss';

const OPTIONS = [
   { value: 'varsel', label: 'Varselbrev (.xml)' },
   { value: 'planområde', label: 'Planområde (.gml)' }
];

function Validate({ username }) {
   const [optionSelected, setOptionSelected] = useState('varsel');

   function handleSelect({ value }) {
      setOptionSelected(value);
   }

   return (
      <Fragment>
         <div className="select-dataset">
            <SelectDropdown name="output" className="select-dropdown-validate" options={OPTIONS} value={OPTIONS[0]} onSelect={handleSelect} />
         </div>
         {
            optionSelected === 'varsel' ?
               <ValidateVarselbrev username={username} /> :
               <ValidatePlanområde username={username} />
         }
      </Fragment>
   );
}

export default Validate;