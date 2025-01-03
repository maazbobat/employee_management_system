import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from React 18
import './index.css';
import App from './App';
import ApolloProvider from './ApolloProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider>
    <App />
  </ApolloProvider>
);