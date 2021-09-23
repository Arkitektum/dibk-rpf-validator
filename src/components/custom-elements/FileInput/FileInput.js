import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types'
import './FileInput.scss';

const createRandomId = () => Math.random().toString(36).substring(4);

const FileInput = forwardRef(({ name, fileList, onChange, accept, multiple, maxFiles = -1 }, ref) => {
   const defaultPlaceholder = `Ingen ${multiple ? 'filer' : 'fil'} valgt...`;
   const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
   const fileInput = useRef(null);
   const inputId = createRandomId();

   useImperativeHandle(ref, () => ({
      reset() {
         resetInput();
      }
   }));
   
   function handleChange(event) {
      const files = Array.from(event.target.files);

      if (!files.length || fileCountExceeded(files)) {
         resetInput();
         updateFileList([{ name, file: null }]);
         return;
      }

      updateFileList(files.map(file => ({ name, file })));
      setPlaceholder(files.map(file => file.name).join(', '));
   }

   function updateFileList(uploadFiles) {
      const toAdd = [];
      const toRemove = [];

      uploadFiles.forEach(uploadFile => {
         if (uploadFile.file !== null) {
            toAdd.push(uploadFile);
         } else {
            toRemove.push(uploadFile);
         }
      });

      const newFileList = fileList
         .filter(uploadFile => !toRemove.some(file => file.name === uploadFile.name))
         .concat(toAdd);

         onChange(newFileList);
   }
   
   function resetInput() {
      fileInput.current.value = '';
      setPlaceholder(defaultPlaceholder);
   }

   function fileCountExceeded(files) {
      return maxFiles !== -1 && files.length > maxFiles;
   }

   return (
      <div className="custom-file">
         <input type="file" ref={fileInput} name={name} accept={accept} id={inputId} multiple={multiple} className="custom-file-input" onChange={handleChange} />
         <label className="custom-file-label" htmlFor={inputId}>{placeholder}</label>
      </div>
   );
});

FileInput.propTypes = {
   //name: PropTypes.string.isRequired,
   onChange: PropTypes.func.isRequired
}

export default FileInput