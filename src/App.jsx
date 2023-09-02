import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import { DarkModeProvider } from "./context/DarkModeContext";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import Spinner from "./ui/Spinner";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Bookings = lazy(() => import("./pages/Bookings"));
const Cabins = lazy(() => import("./pages/Cabins"));
const NewUsers = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Login = lazy(() => import("./pages/Login"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Account = lazy(() => import("./pages/Account"));
const Booking = lazy(() => import("./pages/Booking"));
const Checkin = lazy(() => import("./pages/Checkin"));

// react query: step 1) creating a place to hold the data (cache)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000,
    },
  },
});

function App() {
  // step 2 for react query: provide the data for the whole tree
  return (
    <Suspense fallback={<Spinner />}>
      <DarkModeProvider>
        <QueryClientProvider client={queryClient}>
          {/* adding the react query devtools to the app */}
          <ReactQueryDevtools initialIsOpen={false} />

          <GlobalStyles />
          <BrowserRouter>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate replace to='dashboard' />} />
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='bookings' element={<Bookings />} />
                <Route path='bookings/:bookingId' element={<Booking />} />
                <Route path='checkin/:bookingId' element={<Checkin />} />
                <Route path='cabins' element={<Cabins />} />
                <Route path='users' element={<NewUsers />} />
                <Route path='settings' element={<Settings />} />
                <Route path='account' element={<Account />} />
              </Route>
              <Route path='login' element={<Login />} />
              <Route path='*' element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>

          <Toaster
            position='top-center'
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
          />
        </QueryClientProvider>
      </DarkModeProvider>
    </Suspense>
  );
}

export default App;
