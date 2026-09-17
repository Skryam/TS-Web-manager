import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter } from 'react-router-dom';

import { getClient } from './apollo/client.ts';
import { App } from './JSX/App.tsx';
import './i18n/i18n.ts';
import FlashProvider from './JSX/components/FlashProvider.tsx';

const client = getClient();

const mountNode = document.getElementById('root')!;
const root = ReactDOM.createRoot(mountNode);

root.render(
  <FlashProvider>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </FlashProvider>,
);
