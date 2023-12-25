#ifndef REMOTECONTROL_H
#define REMOTECONTROL_H

#include <Arduino.h>
#include <WiFiS3.h>
#include <aWOT.h>

// define routes callback function signature
typedef void (*RemoteControlRoutesCallback)(Application &app);

class RemoteControl {
public:
  RemoteControl(const char* SSID, const char* SSIDPassword);  
  ~RemoteControl();
  void setup(RemoteControlRoutesCallback routes);
  void process();
private:
  const String _SSID;
  const String _SSIDPassword;
  WiFiServer _server;
  Application _app;

  void _setupNetwork();
};

#endif