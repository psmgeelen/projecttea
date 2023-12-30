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

RemoteControl::RemoteControl(const char* SSID, const char* SSIDPassword) : 
  _SSID(SSID), _SSIDPassword(SSIDPassword),
  _server(80), _app()
{
}

RemoteControl::~RemoteControl() {
}

void RemoteControl::_setupNetwork() {
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

  Serial.print("Connecting to ");
  Serial.println(_SSID);
  
  int attempts = 0;
  while (WL_CONNECTED != WiFi.status()) { // try to connect to the network
    attempts++;
    Serial.println("Atempt to connect: " + String(attempts));
    WiFi.begin(_SSID.c_str(), _SSIDPassword.c_str());
    for (int i = 0; i < 50; i++) { // wait for connection
      Serial.print(".");
      delay(500);
      if (WL_CONNECTED == WiFi.status()) break;
    }
    Serial.println();
    Serial.println("Connection status: " + String(WiFi.status()));
  }
  Serial.println();

  debugNetworkInfo();
}

void RemoteControl::setup(RemoteControlRoutesCallback routes) {
  _setupNetwork();
  routes(_app); // setup routes
  _server.begin();
}

void RemoteControl::process() {
  // TODO: check if we still have a connection. If not, reconnect.
  WiFiClient client = _server.available();

  if (client.connected()) {
    _app.process(&client);
    client.stop();
  }
}

String RemoteControl::asJSONString() const {
  String result = "{";
  result += "\"SSID\": \"" + _SSID + "\",";
  result += "\"signal strength\": " + String(WiFi.RSSI());
  result += "}";
  return result;
}