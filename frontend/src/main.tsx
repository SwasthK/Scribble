import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { RecoilRoot } from "recoil";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </RecoilRoot>
);
