import React from 'react';
import { useSelector } from 'react-redux';
import { CWaterPumpAPI } from '../api/CWaterPumpAPI.js';

const WaterPumpAPIContext = React.createContext();

export function useWaterPumpAPI() {
  return React.useContext(WaterPumpAPIContext);
}

export function WaterPumpAPIProvider({ children }) {
  const apiHost = useSelector((state) => state.UI.apiHost);
  const apiObject = React.useMemo(
    () => new CWaterPumpAPI({ URL: apiHost }),
    [apiHost]
  );

  const value = { API: apiObject, };
  return (
    <WaterPumpAPIContext.Provider value={value}>
      {children}
    </WaterPumpAPIContext.Provider>
  );
}