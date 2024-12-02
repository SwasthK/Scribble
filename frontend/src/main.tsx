import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import 'non.geist'
// import { Toaster } from "./components/ui/toaster.tsx"

import { RecoilRoot } from "recoil";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

import { Toaster } from "react-hot-toast";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

// Axios - Config
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // retry: 5,
      // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </RecoilRoot>
);
