#ifndef ADJUSTEDWATERPUMP_H
#define ADJUSTEDWATERPUMP_H
#include <IWaterPump.h>
#include <math.h>

// lightweight wrapper around IWaterPump
// its purpose is to adjust power value to the range of 0..255, for now
class AdjustedWaterPump: public IWaterPump {
private:
  const IWaterPumpPtr _pump;
public:
  AdjustedWaterPump(IWaterPumpPtr pump) : _pump(pump) {}
  virtual ~AdjustedWaterPump() override {}
  
  virtual void setup() override { _pump->setup(); }
  virtual void stop() override { _pump->stop(); }
  virtual bool isRunning() const override { return _pump->isRunning(); }

  virtual void start(int powerInPercents) override {
    // convert percents to 0..255 range, using float
    const float power = (255.0f / 100.0f) * (float)powerInPercents;
    _pump->start(floor(power));
  }
};

#endif