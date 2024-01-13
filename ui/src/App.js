import React from 'react';
import './App.css';
import { Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import NotificationsArea from './components/NotificationsArea.js';
import APIAddressField from './components/APIAddressField.js';
import PourTimeField from './components/PourTimeField.js';
import SystemControls from './components/SystemControls.js';
import SystemStatusArea from './components/SystemStatusArea.js';
import CurrentOperationInfoArea from './components/CurrentOperationInfoArea.js';
import HoldToPour from './components/HoldToPour.js';

function App({ isConnected }) {
  return (
    <Container className="App">
      <h1>Tea System UI</h1>
      <SystemStatusArea />

      <Form>
        <APIAddressField />
        {isConnected ? (
          <>
            <PourTimeField />
            <CurrentOperationInfoArea />
            <SystemControls />
            <HoldToPour />
          </>
        ) : null}
      </Form>

      <div className="spacer my-3" />
      <NotificationsArea />
    </Container>
  );
}

export default connect(
  state => ({
    isConnected: (null !== state.systemStatus),
  }), []
)(App);