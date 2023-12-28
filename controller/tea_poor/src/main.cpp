#include <Arduino.h>
#include <WaterPumpController.h>
#include <WaterPumpScheduler.h>
#include <RemoteControl.h>

// Setting up water pump
WaterPumpScheduler waterPump(
  new WaterPumpController(12, 9, 3)
);
// Just for safety reasons, we don't want to pour tea for too long
// Their is no reason to make it configurable and add unnecessary complexity
const int WATER_PUMP_SAFE_THRESHOLD = 10 * 1000;

// setting up remote control
RemoteControl remoteControl(
  "MyWiFiNetwork", // network name/SSID
  "VerySecurePassword" // network password
);

void _sendSystemStatus(Response &res) {
  // send system status as JSON
  res.println("{");
  // send water threshold
  res.print("\"water threshold\": ");
  res.print(WATER_PUMP_SAFE_THRESHOLD);
  res.println(",");
  
  // send water pump status
  const auto waterPumpStatus = waterPump.status();
  res.println("\"pump\": {");
  res.print("\"running\": ");
  res.print(waterPumpStatus.isRunning ? "true, " : "false, ");
  const unsigned long timeLeft = 
    waterPumpStatus.isRunning ?
    waterPumpStatus.stopTime - millis() :
    0;
  res.print("\"time left\": ");
  res.print(timeLeft);
  res.println("},");
  // end of water pump status
  ///////////////////////////////////
  // send remote control status
  res.print("\"remote control\": ");
  res.print(remoteControl.asJSONString());
  res.println();
  // end of JSON
  res.println("}");
}

bool isValidIntNumber(const char *str, const int maxValue, const int minValue=0) {
  if (strlen(str) < 1) return false;
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
  // start pouring tea
  waterPump.start( atoi(milliseconds), millis() );
  _sendSystemStatus(res);
}

void setup() {
  Serial.begin(9600);
  waterPump.setup();
  remoteControl.setup([](Application &app) {
    app.get("/pour_tea", pour_tea);
    // stop water pump
    app.get("/stop", [](Request &req, Response &res) {
      waterPump.stop();
      _sendSystemStatus(res);
    });
    // get system status
    app.get("/status", [](Request &req, Response &res) {
      _sendSystemStatus(res);
    });
  });
}

void loop() {
  waterPump.tick(millis());
  remoteControl.process();
};