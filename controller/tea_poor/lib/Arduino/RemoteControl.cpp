#include "RemoteControl.h"

void printMacAddress(byte mac[]) {
  for (int i = 0; i < 6; i++) {
    if (i > 0) {
      Serial.print(":");
    }
    if (mac[i] < 16) {
      Serial.print("0");
    }
    Serial.print(mac[i], HEX);
  }
  Serial.println();
}

void debugNetworkInfo() {
  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());

  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the MAC address of the router you're attached to:
  byte bssid[6];
  WiFi.BSSID(bssid);
  Serial.print("BSSID: ");
  printMacAddress(bssid);

  // print the received signal strength:
  Serial.print("signal strength (RSSI): ");
  Serial.println(WiFi.RSSI());

  // print the encryption type:
  Serial.print("Encryption Type: ");
  Serial.println(WiFi.encryptionType(), HEX);

  Serial.println("----------------------------------------------");
  Serial.println();
}

void verifyNetwork() {
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while(true) delay(500);
  }

  String firmware_version = WiFi.firmwareVersion();
  if ( firmware_version < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.print("Latest available version: ");
    Serial.println(WIFI_FIRMWARE_LATEST_VERSION);
    Serial.println("Please upgrade your firmware.");
  }
}

RemoteControl::RemoteControl(const NetworkConnectCallback &onConnect) :
  _onConnect(onConnect)
{
}

RemoteControl::~RemoteControl() {
}

void RemoteControl::connectTo(const char* ssid, const char* password) {
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  int attempts = 0;
  while (WL_CONNECTED != WiFi.status()) { // try to connect to the network
    attempts++;
    Serial.println("Attempt to connect: " + String(attempts));
    WiFi.begin(ssid, password);
    for (int i = 0; i < 50; i++) { // wait for connection
      Serial.print(".");
      delay(500);
      if (WL_CONNECTED == WiFi.status()) break;
    }
    Serial.println();
    Serial.println("Connection status: " + String(WiFi.status()));
  }
  Serial.println();
  // successfully connected
  debugNetworkInfo();
}

void RemoteControl::setup() { reconnect(); }

void RemoteControl::reconnect() {
  // reset everything
  WiFi.disconnect();
  verifyNetwork();
  _app = Application(); // reset routes
  _server = WiFiServer(80); // reset server
  // reconnect
  _onConnect(*this, _app);
  _server.begin();
}

void RemoteControl::process() {
  const auto status = WiFi.status();
  // TODO: verify if this is the correct way to detect if we need to reconnect
  const bool needsReconnect = (
    (WL_CONNECT_FAILED == status) ||
    (WL_CONNECTION_LOST == status) ||
    (WL_DISCONNECTED == status)
  );
  if(needsReconnect) {
    reconnect();
    return; // wait for next tick, just to be sure that all is ok
  }
  ///////////////////////////
  WiFiClient client = _server.available();

  if (client.connected()) {
    _app.process(&client);
    client.stop();
  }
}