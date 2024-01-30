#ifndef WATERPUMPSCHEDULER_H
#define WATERPUMPSCHEDULER_H

#include <IWaterPump.h>
#include <IWaterPumpSchedulerAPI.h>

// This class is responsible for scheduling water pump
// It is used to make sure that water pump is running for a limited time
// It is also ensuring that water pump is stopped if not needed
class WaterPumpScheduler : public IWaterPumpSchedulerAPI {
private:
  IWaterPumpPtr _waterPump;
  unsigned long _stopTime = 0;
  // each X milliseconds will force stop water pump
  unsigned long _forceStopIntervalMs;
public:
  WaterPumpScheduler(IWaterPumpPtr waterPump, unsigned long forceStopIntervalMs);
  WaterPumpScheduler(IWaterPumpPtr waterPump) : WaterPumpScheduler(waterPump, 1000) {}
  ~WaterPumpScheduler();

  void setup();
  // for simplicity and testability we are passing current time as parameter
  void tick(unsigned long currentTimeMs);

  // Public API
  void start(unsigned long runTimeMs, int power, unsigned long currentTimeMs) override;
  void stop() override;
  WaterPumpStatus status() override;
};
#endif