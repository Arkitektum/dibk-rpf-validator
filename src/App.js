import { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { Upload, Response } from 'components/partials';
import { JsonPrint, Dialog } from 'components/custom-elements';
import Logo from 'assets/gfx/logo-dibk.svg';
import './App.scss';

class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
         apiResponse: null
      };

      this.handleUpload = this.handleUpload.bind(this);
      this.handleValidated = this.handleValidated.bind(this);
   }

   handleUpload() {
      this.setState({ apiResponse: null });
   }

   handleValidated(data) {
      this.setState({ apiResponse: data });
   }

   render() {
      return (
         <Provider store={store}>
            <div className="App">
               <div className="container">
                  <header>
                     <h1>
                        <img src={Logo} alt="DiBK" />Validering av reguleringsplanforslag
                  </h1>
                  </header>

                  <div className="paper">
                     <h4>Last opp filer</h4>
                     <Upload onUpload={this.handleUpload} onValidated={this.handleValidated} />
                  </div>

                  {this.renderResponse()}
               </div>
            </div>
            <Dialog />
         </Provider>
      );
   }

   renderResponse() {
      if (!this.state.apiResponse) {
         return '';
      }

      return (
         <div>
            <div className="paper">
               <h4>Resultat</h4>
               <Response data={this.state.apiResponse} />
            </div>

            <div className="paper">
               <h4>Svar fra API</h4>
               <JsonPrint data={this.state.apiResponse} />
            </div>
         </div>
      );
   }
}

export default App;
