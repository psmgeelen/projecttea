import React from 'react';
import './App.css';
import { Container, Form } from 'react-bootstrap';
import { connect } from 'react-redux';

import NotificationsArea from './components/NotificationsArea.js';
import APIAddressField from './components/APIAddressField';
import PourTimeField from './components/PourTimeField';
import SystemControls from './components/SystemControls';
import SystemStatusArea from './components/SystemStatusArea';

function App({ isConnected }) {
  // TODO: Add a fake countdown timer of timeLeft
  return (
    <Container className="App">
      <h1>Tea System UI</h1>
      <SystemStatusArea />

      <Form>
        <APIAddressField />
        {isConnected ? (
          <>
            <PourTimeField />
            <SystemControls />
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