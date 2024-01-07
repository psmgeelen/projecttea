#ifndef FAKE_WATER_PUMP_H
#define FAKE_WATER_PUMP_H

#include <IWaterPump.h>

// Fake water pump
class FakeWaterPump : public IWaterPump {
private:
  bool _isRunning = false;
public:
  void setup() override { _isRunning = false; }
  void start() override { _isRunning = true;  }
  void stop() override  { _isRunning = false; }

  bool isRunning() const override { return _isRunning; }
};

#endif // FAKE_WATER_PUMP_H