#include <Arduino.h>
#include <WaterPumpController.h>
#include <RemoteControl.h>

// Setting up water pump
WaterPumpController waterPumpController(12, 9, 3);
// Just for safety reasons, we don't want to pour tea for too long
// Their is no reason to make it configurable and add unnecessary complexity
const int WATER_PUMP_SAFE_THRESHOLD = 10 * 1000;

// setting up remote control
RemoteControl remoteControl(
  "MyWiFiNetwork", // network name/SSID
  "VerySecurePassword" // network password
);

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
  remoteControl.setup([](Application &app) {
    app.get("/pour_tea", pour_tea);
  });
}

void loop() {
  remoteControl.process();
};