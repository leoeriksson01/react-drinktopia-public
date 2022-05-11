import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import AuthContextProvider from './contexts/AuthContext'
import ShopContextProvider from './contexts/ShopContext'
import SimpleReactLightbox from 'simple-react-lightbox'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1000 * 60 * 2, // 2 minutes
			cacheTime: 1000 * 60 * 60 * 4, // 4 hours
		},
	},
})

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
    <ShopContextProvider>
    <AuthContextProvider>
    <SimpleReactLightbox>
      <App />
      </SimpleReactLightbox>
      </AuthContextProvider>
      </ShopContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
