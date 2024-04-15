import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import ArrayCreditOverviewComponent from './components/ArrayCreditOverviewComponent'; // Import the ArrayCreditOverviewComponent
import { HelmetProvider } from 'react-helmet-async'; // Import HelmetProvider

ReactDOM.render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
            <ArrayCreditOverviewComponent />
        </HelmetProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
reportWebVitals();
