#ifndef WATERPUMPCONTROLLER_H
#define WATERPUMPCONTROLLER_H
#include <IWaterPump.h>

class WaterPumpController: public IWaterPump {
private:
  const int _directionPin;
  const int _brakePin;
  const int _powerPin;
  bool _isRunning = false;
public:
  WaterPumpController(int directionPin, int brakePin, int powerPin);
  virtual ~WaterPumpController() override;
  
  virtual void setup() override;
  virtual void start(int power) override;
  virtual void stop() override;

  virtual bool isRunning() const override { return _isRunning; }
};

#endif