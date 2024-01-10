import React from 'react';
import { connect } from 'react-redux';
import { updateSystemStatus } from '../store/slices/SystemStatus';
import { useWaterPumpAPI } from '../contexts/WaterPumpAPIContext';
import { useNotificationsSystem } from '../contexts/NotificationsContext';

const FETCH_INTERVAL = 5000;
const CHECK_INTERVAL = Math.round(FETCH_INTERVAL / 10);

function WaterPumpStatusProviderComoponent({ children, updateStatus, systemStatus }) {
  const { API } = useWaterPumpAPI();
  const NotificationsSystem = useNotificationsSystem();
  const nextFetchTime = React.useRef(0);

  // Function to fetch water pump status
  const fetchStatus = React.useCallback(async () => {
      const now = Date.now();
      if(now < nextFetchTime.current) return;
      if(null == API) return;
      
      nextFetchTime.current = Number.MAX_SAFE_INTEGER; // prevent concurrent fetches
      try {
        const status = await API.status();
        updateStatus(status);
      } catch (error) {
        NotificationsSystem.alert('Error fetching system status: ' + error.message);
        updateStatus(null);
      }
      nextFetchTime.current = Date.now() + FETCH_INTERVAL;
    },
    [API, NotificationsSystem, updateStatus, nextFetchTime]
  );

  // Effect to start fetching periodically and when API changes
  React.useEffect(() => {
    const timer = setInterval(fetchStatus, CHECK_INTERVAL);
    return () => { clearInterval(timer); };
  }, [fetchStatus]);

  // Effect to reset timer when system status changes
  React.useEffect(() => {
    // reset timer if not fetching
    const now = Date.now();
    if(now < nextFetchTime.current) {
      nextFetchTime.current = 0;
    }
  }, [API, systemStatus, nextFetchTime]);

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}

export default connect(
  (state) => ({ 
    systemStatus: state.systemStatus
  }), {
    updateStatus: updateSystemStatus
  
  }
)(WaterPumpStatusProviderComoponent);