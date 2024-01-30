#ifndef FAKE_WATER_PUMP_H
#define FAKE_WATER_PUMP_H

#include <IWaterPump.h>

// Fake water pump
class FakeWaterPump : public IWaterPump {
private:
  bool _isRunning = false;
  int _powerInPercents = 0;
public:
  void setup() override { _isRunning = false; }
  void stop() override  { _isRunning = false; }
  void start(int powerInPercents) override {
    _isRunning = true;
    _powerInPercents = powerInPercents;
  }

  bool isRunning() const override { return _isRunning; }
  int powerInPercents() const { return _powerInPercents; }
};

#endif // FAKE_WATER_PUMP_H