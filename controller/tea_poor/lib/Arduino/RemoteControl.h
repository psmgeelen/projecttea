#ifndef REMOTECONTROL_H
#define REMOTECONTROL_H

#include <Arduino.h>
#include <WiFiS3.h>
#include <aWOT.h>
#include <functional>

// forward declaration
class RemoteControl;

// define callback for (re)connecting to WiFi, use std::function
typedef std::function<void(RemoteControl&, Application&)> NetworkConnectCallback;

class RemoteControl {
public:
  RemoteControl(const NetworkConnectCallback &onConnect);
  ~RemoteControl();
  void setup();
  void process();
  void reconnect();
  ///////////////////
  void connectTo(const char* ssid, const char* password);
private:
  NetworkConnectCallback _onConnect;
  WiFiServer _server;
  Application _app;

  void _setupNetwork();
};

#endif