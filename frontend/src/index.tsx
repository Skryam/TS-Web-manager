import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter } from 'react-router-dom';

import { getClient } from './apollo/client.ts';
import { App } from './App.tsx';
import './i18n/i18n.ts';

const client = getClient();

const mountNode = document.getElementById('root')!;
const root = ReactDOM.createRoot(mountNode);

root.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>
);