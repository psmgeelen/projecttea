#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFiS3.h>
#include <aWOT.h>
#include <WaterPumpController.h>

// Setting up water pump
WaterPumpController waterPumpController(12, 9, 3);
// Just for safety reasons, we don't want to pour tea for too long
// Their is no reason to make it configurable and add unnecessary complexity
const int WATER_PUMP_SAFE_THRESHOLD = 10 * 1000;

// setting up WiFi
const char *SSID = "MyWiFiNetwork";
const char *PWD = "VerySecurePassword";

// minimalistic webserver
WiFiServer server(80);
Application app;

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

void printCurrentNet() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the MAC address of the router you're attached to:
  byte bssid[6];
  WiFi.BSSID(bssid);
  Serial.print("BSSID: ");
  printMacAddress(bssid);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.println(rssi);

  // print the encryption type:
  byte encryption = WiFi.encryptionType();
  Serial.print("Encryption Type:");
  Serial.println(encryption, HEX);
  Serial.println();
}

void connectToWiFi() {
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // block further activity
    while(true) delay(500);
  }

  // info about your adapter 
  String firmware_version = WiFi.firmwareVersion();

  Serial.print("WiFi Firmware Version: ");
  Serial.println(firmware_version);
  if ( firmware_version < WIFI_FIRMWARE_LATEST_VERSION) {
    Serial.print("Latest available version: ");
    Serial.println(WIFI_FIRMWARE_LATEST_VERSION);
    Serial.println("Please upgrade your firmware.");
  }

  Serial.print("Connecting to ");
  Serial.println(SSID);

  WiFi.begin(SSID, PWD);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }

  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());
  printCurrentNet();
}

bool isValidIntNumber(const char *str, const int maxValue, const int minValue=0) {
  if (strlen(str) <= 0) return false;
  const int value = atoi(str);
  if (value < minValue) return false;
  if (maxValue <= value) return false;
  return true;
}

void pour_tea(Request &req, Response &res) {
  char milliseconds[64];
  req.query("milliseconds", milliseconds, 64);
  if (!isValidIntNumber(milliseconds, WATER_PUMP_SAFE_THRESHOLD)) {
    res.println("Please specify amount of milliseconds in query parameter; pour_tea?milliseconds=10 e.g.");
    res.print("Maximal allowed time is: ");
    res.println(WATER_PUMP_SAFE_THRESHOLD);
    return;
  }
  const int pouringDelayMs = atoi(milliseconds);
  // actually pour tea
  waterPumpController.pour(pouringDelayMs);

  // Serial.println(req.JSON());
  res.print("Poured Tea in: ");
  res.print(pouringDelayMs);
  res.print(" milliseconds!");
}

void setup() {
  Serial.begin(9600);
  waterPumpController.setup();
  
  // connect to WiFi
  connectToWiFi();

  // Set endpoints
  app.post("/pour_tea", &pour_tea);
  // setup Server
  server.begin();
}

void loop() {
  WiFiClient client = server.available();

  if (client.connected()) {
    app.process(&client);
    client.stop();
  }
};