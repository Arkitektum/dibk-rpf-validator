import React, { useEffect, useRef, useState } from 'react';
import './JsonPrint.scss';

const jsonLineRegex = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*|\[\])?([,[{])?$/mg;

const replacer = (_, pIndent, pKey, pValue, pEnd) => {
   const key = '<span class="json-key">';
   const value = '<span class="json-value">';
   const string = '<span class="json-string">';
   let replaced = pIndent || '';

   if (pKey) {
      replaced = replaced + key + pKey.replace(/[": ]/g, '') + '</span>: ';
   }

   if (pValue) {
      replaced = replaced + (pValue[0] === '"' ? string : value) + pValue + '</span>';
   }

   return replaced + (pEnd || '');
};

function JsonPrint({ data }) {
   const [htmlString, setHtmlString] = useState(null);
   const [copied, setCopied] = useState(false);
   const jsonPrintRef = useRef(null);

   useEffect(
      () => {
         const htmlStr = JSON.stringify(data, null, 2)
            .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(jsonLineRegex, replacer);

         setHtmlString(htmlStr);
      },
      [data]
   );

   function copyText() {
      navigator.clipboard.writeText(jsonPrintRef.current.textContent)
         .then(() => {
            const timeout = setTimeout(() => {
               setCopied(false);
               clearTimeout(timeout);
            }, 1500);

            setCopied(true);
         });
   }

   if (!data) {
      return null;
   }

   return (
      <div className="json-print-container">
         <button className={`copy-button ${copied ? 'copy-button--text-copied' : ''}`} onClick={copyText} title="Kopier tekst"></button>
         
         <div className="json-print">            
            <code ref={jsonPrintRef}>
               <pre dangerouslySetInnerHTML={{ __html: htmlString }}></pre>
            </code>
         </div>
      </div>
   );
}

export default JsonPrint