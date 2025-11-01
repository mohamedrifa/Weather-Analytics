import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './app/store';
import Dashboard from './components/Dashboard';
import { setUnits } from './features/settings/settingsSlice';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CityDetails from "./components/CityDetails";

function SettingsBar() {
  const dispatch = useDispatch();
  const units = useSelector((s) => s.settings.units);
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', padding: 8 }}>
      <label style={{ color: '#333' }}>
      <input
      type="radio"
      checked={units === 'metric'}
      onChange={() => dispatch(setUnits('metric'))}
      name="units"
      />
      Celsius
      </label>
      <label style={{ color: '#333' }}>
      <input
      type="radio"
      checked={units === 'imperial'}
      onChange={() => dispatch(setUnits('imperial'))}
      name="units"
      />
      Fahrenheit
      </label>
    </div>
  );
}


function AppRoot() {
  return (
    <Provider store={store}>
      <div style={{ minHeight: '100vh', background: '#f7f7f9' }}>
        <SettingsBar />
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
