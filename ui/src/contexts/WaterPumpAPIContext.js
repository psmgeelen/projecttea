import React from 'react';
import { CWaterPumpAPI } from '../api/CWaterPumpAPI.js';

const STORE_API = 'apiAddress';
const WaterPumpAPIContext = React.createContext();

export function useWaterPumpAPI() {
  return React.useContext(WaterPumpAPIContext);
}

function preprocessApiHost(apiHost) {
  let url = apiHost;
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'http://' + url;
  }
  if (!url.endsWith('/')) url += '/';
  return url;
}

export function WaterPumpAPIProvider({ children }) {
  const [apiHost, setApiHost] = React.useState('');
  React.useEffect(() => {
    const storedApiHost = localStorage.getItem(STORE_API);
    if (storedApiHost) setApiHost(storedApiHost);
  }, []); // on mount only

  const apiObject = React.useMemo(() => {
      if (!apiHost) return null; // not ready yet

      const url = preprocessApiHost(apiHost);
      localStorage.setItem(STORE_API, url);
      return new CWaterPumpAPI({ URL: url });
    }, [apiHost]
  );

  const value = {
    API: apiObject,
    apiHost: apiHost,
    bindApiHost: setApiHost,
  };

  return (
    <WaterPumpAPIContext.Provider value={value}>
      {children}
    </WaterPumpAPIContext.Provider>
  );
}
