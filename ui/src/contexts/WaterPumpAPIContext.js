import React from 'react';
import { connect } from 'react-redux';
import { CWaterPumpAPI } from '../api/CWaterPumpAPI.js';
import { updateSystemStatus } from '../store/slices/SystemStatus.js';

const WaterPumpAPIContext = React.createContext();

export function useWaterPumpAPI() {
  return React.useContext(WaterPumpAPIContext);
}

const FETCH_STATUS_INTERVAL = 5000;

function _publicWrapper({ apiObject, apiQueue, _pouringTime, _powerLevel }) {
  if(null == apiObject) return { API: null };
  return {
    API: {
      stopPump: () => {
        apiQueue.push({
          action: async () => await apiObject.stop(),
          failMessage: 'Failed to stop the pump'
        });
      },
      startPump: () => {
        apiQueue.push({
          action: async () => await apiObject.start(
            _pouringTime.current,
            _powerLevel.current
          ),
          failMessage: 'Failed to start the pump'
        });
      },
    }
  };
}

function _makeStatusAction(apiObject) {
  return {
    action: async () => await apiObject.status(),
    failMessage: 'Failed to get the pump status'
  };
}

async function _processQueue({ apiQueue, lastUpdateTime, statusAction, updateStatus }) {
  const deltaTime = Date.now() - lastUpdateTime.current;
  const hasTasks = (0 < apiQueue.length);
  if((deltaTime < FETCH_STATUS_INTERVAL) && !hasTasks) return;
    
  const action = hasTasks ? apiQueue.shift() : statusAction;
  const oldTime = lastUpdateTime.current;
  lastUpdateTime.current = Number.MAX_SAFE_INTEGER; // prevent concurrent tasks, just in case
  try {
    await updateStatus(action);
    lastUpdateTime.current = Date.now();
  } catch(error) {
    lastUpdateTime.current = oldTime;
    if(hasTasks) { // re-queue the action if it failed
      apiQueue.unshift(action);
    }
    throw error;
  }
}

function WaterPumpAPIProviderComponent({
  children,
  apiHost, pouringTime, powerLevel,
  updateStatus,
}) {
  // to prevent the callbacks from changing when the pouringTime or powerLevel changes
  const _pouringTime = React.useRef(pouringTime);
  React.useEffect(() => { _pouringTime.current = pouringTime; }, [pouringTime]);

  const _powerLevel = React.useRef(powerLevel);
  React.useEffect(() => { _powerLevel.current = powerLevel; }, [powerLevel]);
  
  const { apiObject, apiQueue } = React.useMemo(
    () => ({
      apiObject: new CWaterPumpAPI({ URL: apiHost }),
      apiQueue: []
    }),
    [apiHost]
  );
  ////////////////
  const statusAction = React.useMemo(() => _makeStatusAction(apiObject), [apiObject]);
  const lastUpdateTime = React.useRef(0);
  const onTick = React.useCallback(
    async () => _processQueue({ apiQueue, lastUpdateTime, statusAction, updateStatus }),
    [apiQueue, lastUpdateTime, updateStatus, statusAction]
  );

  // Run the timer
  React.useEffect(() => {
    const timer = setInterval(onTick, 100);
    return () => { clearInterval(timer); };
  }, [onTick]);

  ////////////////
  const value = React.useMemo(
    () => _publicWrapper({ apiObject, apiQueue, _pouringTime, _powerLevel }),
    [apiObject, apiQueue, _pouringTime, _powerLevel]
  );
  return (
    <WaterPumpAPIContext.Provider value={value}>
      {children}
    </WaterPumpAPIContext.Provider>
  );
}

const WaterPumpAPIProvider = connect(
  state => ({
    apiHost: state.UI.apiHost,
    pouringTime: state.UI.pouringTime,
    powerLevel: state.UI.powerLevelInPercents,
  }),
  { updateStatus: updateSystemStatus }
)(WaterPumpAPIProviderComponent);

export default WaterPumpAPIProvider;
export { WaterPumpAPIProvider };