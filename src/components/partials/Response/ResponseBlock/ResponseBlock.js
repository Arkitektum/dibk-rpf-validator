import React from 'react';
import { useState } from 'react';
import ResponseRow from '../ResponseRow/ResponseRow';
import { createRandomId } from 'utils/utils';
import './ResponseBlock.scss';

const ResponseBlock = ({ title, list, expandable = true, maxHeight = true }) => {
   const [expanded, setExpanded] = useState(false);

   const handleClick = () => {
      setExpanded(!expanded);
   }

   if (!list.length) {
      return '';
   }

   return (
      <div className={`response-block ${expandable ? 'response-block-expandable' : ''} ${!expanded && expandable ? 'response-block-collapsed' : ''}`}>
         <h6  {...(expandable && { onClick: handleClick })}>{title} ({list.length})</h6>
         <div className={`response ${maxHeight ? 'response-max-height' : ''}`}>
            {list.map(element => <ResponseRow key={createRandomId()} data={element} />)}
         </div>
      </div>
   );
};

export default ResponseBlock