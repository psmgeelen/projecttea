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
  stop();
}

void WaterPumpController::start() {
  _isRunning = true;
  digitalWrite(_brakePin, LOW); // release breaks
  analogWrite(_powerPin, 255);
}

void WaterPumpController::stop() {
  digitalWrite(_brakePin, HIGH); // activate breaks
  analogWrite(_powerPin, 0);
  _isRunning = false;
}