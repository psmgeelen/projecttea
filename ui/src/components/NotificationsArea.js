import React from 'react';
import { Alert } from 'react-bootstrap';
import { useNotificationsSystem } from '../contexts/NotificationsContext';

function NotificationsArea() {
  const NotificationsSystem = useNotificationsSystem();
  const { currentNotifications } = NotificationsSystem;
  if(!currentNotifications) return null;

  const hideNotifications = () => { NotificationsSystem.clear(); };

  return (
    <Alert variant="info" onClose={hideNotifications} dismissible>
      {currentNotifications.message}
    </Alert>
  );
}

export default NotificationsArea;
