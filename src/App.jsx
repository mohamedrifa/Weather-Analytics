import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Dashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CityDetails from "./components/CityDetails";


function AppRoot() {
  return (
    <Provider store={store}>
      <div style={{ minHeight: '100vh', background: '#f7f7f9' }}>
        <Dashboard />
      </div>
    </Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppRoot />} />
        <Route path="/city/:lat/:lon" element={<CityDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
