// FakeWaterPumpSchedulerAPI.h is a mock class for WaterPumpSchedulerAPI.h
#ifndef FAKE_WATER_PUMP_SCHEDULER_API_H
#define FAKE_WATER_PUMP_SCHEDULER_API_H

#include <IWaterPumpSchedulerAPI.h>
#include <string>

class FakeWaterPumpSchedulerAPI : public IWaterPumpSchedulerAPI {
public:
  void stop() override {
    _log += "stop()\n";
  }

  void start(unsigned long runTimeMs, unsigned long currentTimeMs) override {
    _log += "start(" + std::to_string(runTimeMs) + ", " + std::to_string(currentTimeMs) + ")\n";
  }

  WaterPumpStatus status() override {
    return _status;
  }
  
  WaterPumpStatus _status;
  std::string _log;
};

#endif