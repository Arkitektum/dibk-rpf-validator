export const groupBy = (arr, criteria) => {
	return arr.reduce((obj, item) => {
		const key = typeof criteria === 'function' ? criteria(item) : item[criteria];

		if (!obj.hasOwnProperty(key)) {
			obj[key] = [];
		}

		obj[key].push(item);

		return obj;
	}, {});
};

export const allEqual = array => array.every(value => value === array[0]);

const getValidGmlFiles = (files, apiResponse, ruleIds) => {
   return files.filter(file => {   
      return ruleIds.every(ruleId => {
         return !apiResponse.validationRules.some(rule => rule.id === ruleId && rule.messages.some(message => message.fileName === file.name));
      })        
   });
};

const readGmlDocument = file => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
         const parser = new DOMParser();
         const gmlDoc = parser.parseFromString(event.target.result, 'text/xml');
         resolve(gmlDoc)
      };

      reader.onerror = reject;
      reader.readAsText(file);
   });
};

export const getValidGmlDocuments = async (files, apiResponse, ruleIds) => {
   const validFiles = getValidGmlFiles(files, apiResponse, ruleIds);
   const gmlDocs = [];

   for (let i = 0; i < validFiles.length; i++) {
      const gmlDoc = await readGmlDocument(files[i]);
      gmlDocs.push(gmlDoc);
   }

   return gmlDocs;
};