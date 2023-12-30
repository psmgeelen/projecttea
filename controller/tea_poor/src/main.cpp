#include <Arduino.h>
#include <memory>
#include <WaterPumpController.h>
#include <WaterPumpScheduler.h>
#include <RemoteControl.h>
#include "secrets.h"

#include <sstream>
// Setting up water pump
WaterPumpScheduler waterPump(
  std::make_shared<WaterPumpController>(
    WATER_PUMP_DIRECTION_PIN, WATER_PUMP_BRAKE_PIN, WATER_PUMP_POWER_PIN
  )
);
// Just for safety reasons, we don't want to pour tea for too long
// Their is no reason to make it configurable and add unnecessary complexity
const int WATER_PUMP_SAFE_THRESHOLD = 10 * 1000;

// setting up remote control
RemoteControl remoteControl(WIFI_SSID, WIFI_PASSWORD);

void _sendSystemStatus(std::ostream& response) {
  response << "{";
  // send water threshold
  response << "\"water threshold\": " << WATER_PUMP_SAFE_THRESHOLD << ",";
  // send water pump status
  const auto waterPumpStatus = waterPump.status();
  const unsigned long timeLeft = 
    waterPumpStatus.isRunning ?
    waterPumpStatus.stopTime - millis() :
    0;
  response 
    << "\"pump\": {"
    << "  \"running\": " << (waterPumpStatus.isRunning ? "true, " : "false, ")
    << "  \"time left\": " << timeLeft
    << "}";
  // end of water pump status
  ///////////////////////////////////
  // send remote control status
  response << "\"remote control\": " << remoteControl.asJSONString();
  // end of JSON
  response << "}";
}

bool isValidIntNumber(const char *str, const int maxValue, const int minValue=0) {
  if (strlen(str) < 1) return false;
  const int value = atoi(str);
  if (value < minValue) return false;
  if (maxValue <= value) return false;
  return true;
}

void pour_tea(const char *milliseconds, std::ostream &res) {
  if (!isValidIntNumber(milliseconds, WATER_PUMP_SAFE_THRESHOLD)) {
    // send error message as JSON
    res << "{ \"error\": \"invalid milliseconds value\" }";
    return;
  }
  // start pouring tea
  waterPump.start( atoi(milliseconds), millis() );
  _sendSystemStatus(res);
}

void setup() {
  Serial.begin(9600);
  waterPump.setup();
  // TODO: find a way to remove redundant code with string streams
  remoteControl.setup([](Application &app) {
    app.get("/pour_tea", [](Request &req, Response &res) {
      char milliseconds[64];
      req.query("milliseconds", milliseconds, 64);
      
      std::stringstream response;
      pour_tea(milliseconds, response);
      res.println(response.str().c_str());
    });
    // stop water pump
    app.get("/stop", [](Request &req, Response &res) {
      waterPump.stop();
      std::stringstream response;
      _sendSystemStatus(response);
      res.println(response.str().c_str());
    });
    // get system status
    app.get("/status", [](Request &req, Response &res) {
      std::stringstream response;
      _sendSystemStatus(response);
      res.println(response.str().c_str());
    });
  });
}

void loop() {
  waterPump.tick(millis());
  remoteControl.process();
};