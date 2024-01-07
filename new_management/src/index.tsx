import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/assets/css/reset.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store, { persistor } from './redux';
import { PersistGate } from 'redux-persist/integration/react';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <div>
    <Provider store={store} >
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </div>
);


reportWebVitals();
