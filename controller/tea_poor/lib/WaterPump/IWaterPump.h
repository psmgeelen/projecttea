#ifndef IWATERPUMP_H
#define IWATERPUMP_H

class IWaterPump {
public:
  virtual ~IWaterPump() {}

  virtual void setup() = 0;
  virtual void start() = 0;
  virtual void stop() = 0;

  virtual bool isRunning() const = 0;
};

#endif