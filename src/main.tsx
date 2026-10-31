import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient as createNhostClient } from "@nhost/nhost-js";
import { createClient as createUrlClient, Provider as UrqlProvider, fetchExchange } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';

import NhostContext from "../NhostContext.ts";

import './index.css'

import App from './App.tsx'

const nhost = createNhostClient({
  subdomain: "jjqlbfsfzstfvpmqtomo",
  region: "us-east-1",
});

const client = createUrlClient({
  url: 'http://localhost:4000/graphql', // Replace with your GraphQL API endpoint
  exchanges: [
    cacheExchange({

    }),           // Replaces the default document cache
    fetchExchange,   // Handles network requests
  ],
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NhostContext.Provider value={nhost}>
      <UrqlProvider value={client}>
        <App />
      </UrqlProvider>
    </NhostContext.Provider>
  </StrictMode>
);
