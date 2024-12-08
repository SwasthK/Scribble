import App from "./App.tsx";
import ReactDOM from "react-dom/client";

// Fonts & Styles
import "./index.css";
import "non.geist";

// Recoil - Config
import { RecoilRoot } from "recoil";

// TimeAgo - Imports & Config
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";
TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

// Toaster - Imports
import { Toaster } from "react-hot-toast";

// Axios - Imports & Config
import axios from "axios";
axios.defaults.baseURL = "https://server.swasth319.workers.dev/api/v1";

// React Query - Imports & Config
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {},
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
