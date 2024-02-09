import React from 'react';
import { connect } from 'react-redux';
import { startPump, stopPump } from '../store/slices/SystemStatus.js';
import { CWaterPumpAPI } from '../api/CWaterPumpAPI.js';
import WaterPumpStatusProvider from '../components/WaterPumpStatusProvider.js';

const WaterPumpAPIContext = React.createContext();

export function useWaterPumpAPI() {
  return React.useContext(WaterPumpAPIContext);
}

function WaterPumpAPIProviderComponent({
  children,
  apiHost, pouringTime, powerLevel,
  startPump, stopPump,
}) {
  // to prevent the callbacks from changing when the pouringTime or powerLevel changes
  const _pouringTime = React.useRef(pouringTime);
  React.useEffect(() => { _pouringTime.current = pouringTime; }, [pouringTime]);

  const _powerLevel = React.useRef(powerLevel);
  React.useEffect(() => { _powerLevel.current = powerLevel; }, [powerLevel]);
  
  const apiObject = React.useMemo(
    () => new CWaterPumpAPI({ URL: apiHost }),
    [apiHost]
  );
  ////////////////
  // create an API wrapper that dispatches actions to the Redux store
  const value = React.useMemo(
    () => {
      if(null == apiObject) return { API: null };
      return {
        API: {
          stopPump: async () => {
            return await stopPump({ api: apiObject });
          },
          startPump: async () => {
            return await startPump({
              api: apiObject,
              pouringTime: _pouringTime.current,
              powerLevel: _powerLevel.current,
            });
          },
          status: async () => {
            return await apiObject.status();
          }
        }
      };
    },
    [apiObject, startPump, stopPump, _pouringTime, _powerLevel]
  );

  return (
    <WaterPumpAPIContext.Provider value={value}>
      <WaterPumpStatusProvider>
        {children}
      </WaterPumpStatusProvider>
    </WaterPumpAPIContext.Provider>
  );
}

const WaterPumpAPIProvider = connect(
  state => ({
    apiHost: state.UI.apiHost,
    pouringTime: state.UI.pouringTime,
    powerLevel: state.UI.powerLevelInPercents,
  }),
  { startPump, stopPump }
)(WaterPumpAPIProviderComponent);

export default WaterPumpAPIProvider;
export { WaterPumpAPIProvider };