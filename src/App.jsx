import React, { Suspense, lazy } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loader from "./components/Loader";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const CityDetails = lazy(() => import("./pages/CityDetails"));

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<Loader label="Loading..." />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/city/:lat/:lon" element={<CityDetails />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
