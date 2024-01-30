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
  // NOTE: we use one-directional motor, so we can't use direction pin
  //       but I keep it here for future reference
  // pinMode(_directionPin, OUTPUT);
  pinMode(_brakePin, OUTPUT);
  pinMode(_powerPin, OUTPUT);
  stop();
}

void WaterPumpController::start(int powerInPercents) {
  const int power = map(powerInPercents, 0, 100, 0, _maxPower);
  _isRunning = true;
  digitalWrite(_brakePin, LOW); // release breaks
  analogWrite(_powerPin, power);
}

void WaterPumpController::stop() {
  digitalWrite(_brakePin, HIGH); // activate breaks
  analogWrite(_powerPin, 0);
  _isRunning = false;
}