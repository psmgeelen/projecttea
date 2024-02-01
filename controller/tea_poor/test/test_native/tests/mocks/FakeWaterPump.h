#ifndef FAKE_WATER_PUMP_H
#define FAKE_WATER_PUMP_H

#include <IWaterPump.h>

// Fake water pump
class FakeWaterPump : public IWaterPump {
private:
  bool _isRunning = false;
  int _power = 0;
public:
  void setup() override { _isRunning = false; }
  void stop() override  { _isRunning = false; }
  void start(int power) override {
    _isRunning = true;
    _power = power;
  }

  bool isRunning() const override { return _isRunning; }
  int power() const { return _power; }
};

#endif // FAKE_WATER_PUMP_H