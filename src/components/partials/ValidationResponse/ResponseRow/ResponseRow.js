import { useState } from 'react';
import './ResponseRow.scss';

const getStatus = (status) => status === 'NOT_EXECUTED' ? 'skipped' : status.toLowerCase();

const ResponseRow = ({ data }) => {
   const [expanded, setExpanded] = useState(false);

   const handleClick = (event) => {
      if (event.target.nodeName !== "A") {
         setExpanded(!expanded);
      }
   }

   if (!data) {
      return '';
   }

   const hasMessages = data.messages.length > 0;
   const status = getStatus(data.status);

   return (
      <div className={`response-row ${hasMessages ? 'response-row-with-messages' : ''}`}>
         <div className="info" {...(hasMessages && { onClick: handleClick })}>
            <div className="status">
               <span className={`label label-${status}`}>{status}</span>
            </div>
            <div className="name">
               <div>
                  <span>{data.name} {hasMessages ? `(${data.messages.length})` : ''}</span>
                  {data.documentation ? <a className="documentation" href={data.documentation} target="_blank" rel="noreferrer">(Dokumentasjon)</a> : ''}
               </div>
               {data.description ? <span className="description">{data.description}</span> : ''}
            </div>
            <div className="id">{data.id}</div>
         </div>
         {
            hasMessages ?
               <ul className="messages" style={{ display: expanded ? 'block' : 'none' }}>
                  {data.messages.map((message, index) => <li key={index}>{message.message}</li>)}
               </ul> :
               ''
         }
      </div>
   );
};

export default ResponseRow