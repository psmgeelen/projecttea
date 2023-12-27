#include <Arduino.h>
#include "WaterPumpController.h"

WaterPumpController::WaterPumpController(int directionPin, int brakePin, int powerPin) :
  _directionPin(directionPin),
  _brakePin(brakePin),
  _powerPin(powerPin) 
{

}

WaterPumpController::~WaterPumpController() {}

void WaterPumpController::setup() {
  pinMode(_directionPin, OUTPUT);
  pinMode(_brakePin, OUTPUT);
  pinMode(_powerPin, OUTPUT);
  // TODO: check that its okay to do during setup
  stopPump();
}

void WaterPumpController::pour(int milliseconds) {
  startPump();
  delay(milliseconds);
  stopPump();
}

void WaterPumpController::startPump() {
  _state = PUMP_ON;
  digitalWrite(_brakePin, LOW); // release breaks
  analogWrite(_powerPin, 255);
}

void WaterPumpController::stopPump() {
  digitalWrite(_brakePin, HIGH); // activate breaks
  analogWrite(_powerPin, 0);
  _state = PUMP_OFF;
}
