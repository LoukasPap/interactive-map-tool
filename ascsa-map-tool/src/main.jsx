import {
  Center,
  ChakraProvider,
  defaultSystem,
  Spinner,
} from "@chakra-ui/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import App from "./App.jsx";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Landing from "./Components/Landing.jsx";
import { verifyToken } from "./Queries.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    },
  },
});

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // verify the token with the server
  const { data, isLoading, isError } = useQuery({
    queryKey: ["verifyToken", token],
    queryFn: () => verifyToken(token),
    enabled: !!token,
    retry: false,
    staleTime: 1000 * 60 * 45,
  });

  if (!token) {
    console.log("No token");
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
          message: "You must first login to your account",
          status: "error",
        }}
      />
    );
  }

  if (isLoading)
    return (
      <Center w="100vw" h="100vh">
        <Spinner />
      </Center>
    );

  if (isError) {
    localStorage.removeItem("token");
    return (
      <Navigate
        to="/"
        replace
        state={{
          from: location,
          message: "You must first login to your account",
          status: "error",
        }}
      />
    );
  }

  return children;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route
              path="/"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to="/map" replace />
                ) : (
                  <Landing />
                )
              }
            />
            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>
);
