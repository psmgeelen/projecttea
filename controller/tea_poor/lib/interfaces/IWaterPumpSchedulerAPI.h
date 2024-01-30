// IWaterPumpSchedulerAPI interface
#ifndef IWATERPUMPSCHEDULERAPI_H
#define IWATERPUMPSCHEDULERAPI_H

#include <memory>
// pump status
struct WaterPumpStatus {
public:
  bool isRunning;
  unsigned long stopTime;
  // copy constructor
  WaterPumpStatus(const WaterPumpStatus &other) {
    isRunning = other.isRunning;
    stopTime = other.stopTime;
  }
  WaterPumpStatus(bool isRunning, unsigned long stopTime) : isRunning(isRunning), stopTime(stopTime) {}
  // default constructor
  WaterPumpStatus() : isRunning(false), stopTime(0) {}
};

class IWaterPumpSchedulerAPI {
public:
  virtual ~IWaterPumpSchedulerAPI() {}
  virtual void stop() = 0;
  virtual void start(unsigned long runTimeMs, int power, unsigned long currentTimeMs) = 0;
  virtual WaterPumpStatus status() = 0;
};

using IWaterPumpSchedulerAPIPtr = std::shared_ptr<IWaterPumpSchedulerAPI>;
#endif