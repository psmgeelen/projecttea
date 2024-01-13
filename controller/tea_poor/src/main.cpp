#include <Arduino.h>
#include <memory>
#include <WaterPumpController.h>
#include <WaterPumpScheduler.h>
#include <RemoteControl.h>
#include <CommandProcessor.h>
#include "secrets.h"

#include <sstream>
#include <ArduinoEnvironment.h>

IEnvironmentPtr env = std::make_shared<ArduinoEnvironment>();

// Setting up water pump
auto waterPump = std::make_shared<WaterPumpScheduler>(
  std::make_shared<WaterPumpController>(
    WATER_PUMP_DIRECTION_PIN, WATER_PUMP_BRAKE_PIN, WATER_PUMP_POWER_PIN
  )
);

// build command processor
CommandProcessor commandProcessor(
  WATER_PUMP_SAFE_THRESHOLD,
  env,
  waterPump
);

void withExtraHeaders(Response &res) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Content-Type", "application/json");
}

RemoteControl remoteControl(
  // lambda function to setup network
  [](RemoteControl &remoteControl, Application &app) {
    // connect to WiFi
    // set static IP address, if defined in configs
    #ifdef WIFI_IP_ADDRESS
    WiFi.config(WIFI_IP_ADDRESS);
    #endif
    
    remoteControl.connectTo(WIFI_SSID, WIFI_PASSWORD);
    // setup routes
    app.get("/pour_tea", [](Request &req, Response &res) {
      char milliseconds[64];
      req.query("milliseconds", milliseconds, 64);
      
      const auto response = commandProcessor.pour_tea(milliseconds);
      withExtraHeaders(res);
      res.print(response.c_str());
    });
    // stop water pump
    app.get("/stop", [](Request &req, Response &res) {
      const auto response = commandProcessor.stop();
      withExtraHeaders(res);
      res.print(response.c_str());
    });
    // get system status
    app.get("/status", [](Request &req, Response &res) {
      const auto response = commandProcessor.status();
      withExtraHeaders(res);
      res.print(response.c_str());
    });
  }
);

void setup() {
  Serial.begin(9600);
  waterPump->setup();
  remoteControl.setup();
}

void loop() {
  waterPump->tick(millis());
  remoteControl.process();
};