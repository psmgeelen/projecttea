#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFiS3.h>
#include <aWOT.h>

// setting up WiFi
const char *SSID = "MyWiFiNetwork";
const char *PWD = "VerySecurePassword";

// Setting up Motorcontroller
int directionPin = 12;
int pwmPin = 3;
int brakePin = 9;

// minimalistic webserver
WiFiServer server(80);
Application app;

// Start value Threshold for pouring
int threshold_pour = 10;

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
    while(true);
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
    // we can even make the ESP32 to sleep
  }

  Serial.print("Connected. IP: ");
  Serial.println(WiFi.localIP());
  printCurrentNet();
}



void set_threshold(Request &req, Response &res) {
  char seconds_char[64];
  req.query("seconds", seconds_char, 64);

  if (strlen(seconds_char) != NULL){
    threshold_pour = atoi(seconds_char);
    res.print("You have reset the threshold! Please make sure that this is safe, as it aims to prevent overflow due to mistyping the query parameter. The threshold is now set to: ");
    res.print(threshold_pour);
  } else {
    res.print("Please specify amount of seconds in query parameter; threshold?seconds=10 e.g..");
  }
}

void get_threshold(Request &req, Response &res) {
  res.print("The threshold is: ");
  res.print(threshold_pour);
  res.print(" seconds.");
}

void pour_tea(Request &req, Response &res) {
  char seconds_char[64];
  req.query("seconds", seconds_char, 64);
  int pouring_delay = atoi(seconds_char);

  if (strlen(seconds_char) != NULL && pouring_delay <= threshold_pour ){
    //release breaks
    digitalWrite(brakePin, LOW);

    //set work duty for the motor, Duty is the amount of power it is getting from 0 to 256.
    analogWrite(pwmPin, 256);

    delay(pouring_delay*1000); // convert miliseconds to seconds

    //activate breaks
    digitalWrite(brakePin, HIGH);

    //set work duty for the motor to 0 (off)
    analogWrite(pwmPin, 0);
    // Serial.println(req.JSON());
    res.print("Poured Tea in: ");
    res.print(pouring_delay);
    res.print(" seconds!");
  } else if (pouring_delay > threshold_pour) {
    res.print("Exceeded safety threshold for pouring. Change threshold in firmware or use endpoint /flush and set minutes");
  }
  else {
    res.print("Please specify amount of seconds in query parameter; pour_tea?seconds=10 e.g..");
  }
}

void flush(Request &req, Response &res) {
  char minutes_char[64];
  req.query("minutes", minutes_char, 64);

  if (strlen(minutes_char) != NULL){
    //release breaks
    digitalWrite(brakePin, LOW);

    //set work duty for the motor, Duty is the amount of power it is getting from 0 to 256.
    analogWrite(pwmPin, 256);

    int pouring_delay = atoi(minutes_char);
    delay(pouring_delay*1000*60); // convert miliseconds to seconds

    //activate breaks
    digitalWrite(brakePin, HIGH);

    //set work duty for the motor to 0 (off)
    analogWrite(pwmPin, 0);
    // Serial.println(req.JSON());
    res.print("Poured Tea in: ");
    res.print(pouring_delay);
    res.print(" minutes!");
  } else {
    res.print("Please specify amount of seconds in query parameter; flush?minutes=1 e.g..");
  }
}

void setup() {

  // define print serial port
  Serial.begin(9600);
  //define pins
  pinMode(directionPin, OUTPUT);
  pinMode(pwmPin, OUTPUT);
  pinMode(brakePin, OUTPUT);

  // connect to WiFi
  connectToWiFi();

  // Set endpoints
  app.post("/pour_tea", &pour_tea);
  app.post("/flush", &flush);
  app.get("/threshold", &get_threshold);
  app.post("/threshold", &set_threshold);

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