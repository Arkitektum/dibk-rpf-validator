import { useState } from 'react';
import { createRandomId } from 'utils/utils';
import './ResponseRow.scss';

const ResponseRow = ({ data }) => {
   const [expanded, setValue] = useState(false);

   const handleRowClick = () => {
      setValue(!expanded);
   }

   if (!data) {
      return '';
   }

   return (
      <div className="response-row">
         <div className="info" onClick={handleRowClick}>
            <div className="type">
               <span className={`label label-${data.messageType.toLowerCase()}`}>{data.messageType}</span>
            </div>
            <div className="name">{data.name} ({data.messages.length})</div>
            <div className="id">
               <span className="label label-default">{data.id}</span>
            </div>
         </div>
         <ul className="messages" style={{ display: expanded ? 'block' : 'none' }}>
            {data.messages.map(message => <li key={createRandomId()}>{message.message}</li>)}
         </ul>
      </div>
   );
};

export default ResponseRow