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

// setting up remote control
RemoteControl remoteControl(WIFI_SSID, WIFI_PASSWORD);

// build command processor
CommandProcessor commandProcessor(
  WATER_PUMP_SAFE_THRESHOLD,
  env,
  waterPump
);

void setup() {
  Serial.begin(9600);
  waterPump->setup();
  remoteControl.setup([](Application &app) {
    app.get("/pour_tea", [](Request &req, Response &res) {
      char milliseconds[64];
      req.query("milliseconds", milliseconds, 64);
      
      const auto response = commandProcessor.pour_tea(milliseconds);
      res.print(response.c_str());
    });
    // stop water pump
    app.get("/stop", [](Request &req, Response &res) {
      const auto response = commandProcessor.stop();
      res.print(response.c_str());
    });
    // get system status
    app.get("/status", [](Request &req, Response &res) {
      const auto response = commandProcessor.status();
      res.print(response.c_str());
    });
  });
}

void loop() {
  waterPump->tick(millis());
  remoteControl.process();
};