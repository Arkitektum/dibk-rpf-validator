import './JsonPrint.scss';

const jsonLineRegex = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*|\[\])?([,[{])?$/mg;

const replacer = (match, pIndent, pKey, pValue, pEnd) => {
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

const JsonPrint = ({ data }) => {
   if (!data) {
      return '';
   }

   const htmlString = JSON.stringify(data, null, 2)
      .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
      .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(jsonLineRegex, replacer);

   return (
      <div className="jsonPrint">
         <code>
            <pre dangerouslySetInnerHTML={{__html: htmlString}}></pre>
         </code>
      </div>
   );
}

export default JsonPrint