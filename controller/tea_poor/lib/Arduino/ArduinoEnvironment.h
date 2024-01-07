// Arduino environment
#ifndef ARDUINO_ENVIRONMENT_H
#define ARDUINO_ENVIRONMENT_H

#include <IEnvironment.h>
#include <Arduino.h>

class ArduinoEnvironment : public IEnvironment {
  public:
    unsigned long time() const override {
      return millis();
    }
};

#endif // ARDUINO_ENVIRONMENT_H