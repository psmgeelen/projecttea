// FakeWaterPumpSchedulerAPI.h is a mock class for WaterPumpSchedulerAPI.h
#ifndef FAKE_WATER_PUMP_SCHEDULER_API_H
#define FAKE_WATER_PUMP_SCHEDULER_API_H

#include <IWaterPumpSchedulerAPI.h>
#include <IEnvironment.h>
#include <string>

class FakeWaterPumpSchedulerAPI : public IWaterPumpSchedulerAPI {
private:
  const IEnvironmentPtr _env;
public:
  FakeWaterPumpSchedulerAPI(IEnvironmentPtr env) : _env(env) {}

  void stop() override {
    _log += "stop()\n";
  }

  void start(unsigned long runTimeMs, int power) override {
    _log += "start(" + 
      std::to_string(runTimeMs) + ", " +
      std::to_string(power) + ", " +
      std::to_string(_env->time()) +
      ")\n";
  }

  WaterPumpStatus status() override {
    return _status;
  }
  
  WaterPumpStatus _status;
  std::string _log;
};

#endif