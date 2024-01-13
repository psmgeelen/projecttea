import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { NotificationsSystemActions } from '../store/slices/Notifications';

function NotificationsArea({ hasNotifications, message, clearNotifications }) {
  if(!hasNotifications) return null;

  return (
    <Alert variant="info" onClose={clearNotifications} dismissible>
      {message}
    </Alert>
  );
}

export default connect(
  (state) => ({ 
    hasNotifications: state.notifications.currentNotifications != null,
    message: state.notifications.currentNotifications?.message
  }), {
    clearNotifications: NotificationsSystemActions.clear
  }
)(NotificationsArea);