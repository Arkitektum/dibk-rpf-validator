import React, { Fragment, useState } from 'react';
import { Button } from 'react-bootstrap';

function Message({ message }) {
   const [expanded, setExpanded] = useState(false);

   return (
      !message.gmlIds?.length && !message.xPaths?.length ?
         message.message :
         <Fragment>
            <Button variant="link" onClick={() => setExpanded(!expanded)}>{message.message}</Button>

            <div className={`message-info ${expanded ? 'message-info-expanded' : ''}`}>
               {
                  message.xPaths?.length ?
                     <div className="row">
                        <div className="col-1">XPath:</div>
                        <div className="col-11">{message.xPaths.join(', ')}</div>
                     </div> :
                     null
               }
               {
                  message.gmlIds?.length ?
                     <div className="row">
                        <div className="col-1">GML-ID:</div>
                        <div className="col-11">{message.gmlIds.join(', ')}</div>
                     </div> :
                     null
               }
               <div className="row">
                  <div className="col-1">Filnavn:</div>
                  <div className="col-11">{message.fileName}</div>
               </div>
            </div>
         </Fragment>
   );
}

export default Message;