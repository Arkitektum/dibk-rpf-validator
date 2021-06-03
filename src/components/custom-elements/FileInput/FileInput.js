import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import './FileInput.scss';

const createRandomId = () => Math.random().toString(36).substring(4);

const FileInput = forwardRef(({ onChange, accept, multiple, maxFiles = -1 }, ref) => {
   const defaultPlaceholder = `Ingen ${multiple ? 'filer' : 'fil'} valgt...`;
   const inputId = createRandomId();
   const [placeholder, setPlaceholder] = useState(defaultPlaceholder);
   const fileInput = useRef(null);

   useImperativeHandle(ref, () => ({
      reset() {
         resetInput();
      }
   }));

   const resetInput = () => {
      fileInput.current.value = '';
      setPlaceholder(defaultPlaceholder);
   }

   const handleChange = event => {
      const files = Array.from(event.target.files);

      if (!files.length || (maxFiles !== -1 && files.length > maxFiles)) {
         resetInput();
         onChange([]);
         return;
      }

      onChange(files);
      setPlaceholder(files.map(file => file.name).join(', '));
   }

   return (
      <div className="custom-file">
         <input type="file" ref={fileInput} accept={accept} id={inputId} multiple={multiple} className="custom-file-input" onChange={handleChange} />
         <label className="custom-file-label" htmlFor={inputId}>{placeholder}</label>
      </div>
   );
});

export default FileInput