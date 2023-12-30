#ifndef IWATERPUMP_H
#define IWATERPUMP_H

#include <memory>

class IWaterPump {
public:
  virtual ~IWaterPump() {}

  virtual void setup() = 0;
  virtual void start() = 0;
  virtual void stop() = 0;

  virtual bool isRunning() const = 0;
};

// define shared pointer alias
using IWaterPumpPtr = std::shared_ptr<IWaterPump>;
#endif