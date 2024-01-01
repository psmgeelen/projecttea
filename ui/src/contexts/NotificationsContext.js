import React from 'react';

const NotificationsContext = React.createContext();

export function useNotificationsSystem() {
  return React.useContext(NotificationsContext);
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = React.useState(null);

  const value = {
    alert: (message) => { setNotifications({ message }); },
    clear: () => { setNotifications(null); },
    currentNotifications: notifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}