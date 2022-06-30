import React from 'react';
import { useState } from 'react';
import ValidationResponseRow from '../ValidationResponseRow/ValidationResponseRow';
import './ValidationResponseBlock.scss';

function ValidationResponseBlock({ title, list, expandable = true, maxHeight = true }) {
   const [expanded, setExpanded] = useState(false);

   function handleClick() {
      setExpanded(!expanded);
   }

   if (!list.length) {
      return null;
   }

   return (
      <div className={`response-block ${expandable ? 'response-block-expandable' : ''} ${!expanded && expandable ? 'response-block-collapsed' : ''}`}>
         <h6  {...(expandable && { onClick: handleClick })}>{title} ({list.length})</h6>
         <div className={`response ${maxHeight ? 'response-max-height' : ''}`}>
            {list.map((element, index) => <ValidationResponseRow key={index} data={element} />)}
         </div>
      </div>
   );
};

export default ValidationResponseBlock;