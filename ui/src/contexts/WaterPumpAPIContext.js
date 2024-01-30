import React from 'react';
import { useSelector } from 'react-redux';
import { CWaterPumpAPI } from '../api/CWaterPumpAPI.js';
import WaterPumpStatusProvider from '../components/WaterPumpStatusProvider.js';

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
  // TODO: provide also the API methods with binded values from the store
  //       to simplify the code in the components (HodlToPour and PowerLevel)
  const value = { API: apiObject, };
  return (
    <WaterPumpAPIContext.Provider value={value}>
      <WaterPumpStatusProvider>
        {children}
      </WaterPumpStatusProvider>
    </WaterPumpAPIContext.Provider>
  );
}