import React from 'react';
import { Component } from 'react';
import { createRandomId } from 'utils';
import './FileInput.scss';

class FileInput extends Component {
   constructor(props) {
      super(props);

      this.defaultPlaceholder = `Ingen ${this.props.multiple ? 'filer' : 'fil'} valgt...`;
      this.inputId = createRandomId();
      this.handleChange = this.handleChange.bind(this);
      this.fileInput = React.createRef();

      this.state = {
         onChange: this.props.onChange || (() => { }),
         placeholder: this.defaultPlaceholder,
         maxFiles: props.maxFiles || -1
      };
   }

   reset() {
      this.fileInput.current.value = '';
      this.setState({ placeholder: this.defaultPlaceholder });
   }

   handleChange(event) {
      const files = Array.from(event.target.files);

      if (this.state.maxFiles !== -1 && files.length > this.state.maxFiles) {
         this.reset();
         this.state.onChange([]);
         return;
      }

      this.state.onChange(files);
      this.setState({ placeholder: files.map(file => file.name).join(', ') });
   }

   render() {
      const placeholder = this.state.placeholder ? this.state.placeholder : this.defaultPlaceholder;

      return (
         <div className="custom-file">
            <input type="file" ref={this.fileInput} accept={this.props.accept} id={this.inputId} multiple={this.props.multiple} className="custom-file-input" onChange={this.handleChange} />
            <label className="custom-file-label" htmlFor={this.inputId}>{placeholder}</label>
         </div>
      );
   }
}

export default FileInput