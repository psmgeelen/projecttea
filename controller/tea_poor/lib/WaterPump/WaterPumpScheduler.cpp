#include "WaterPumpScheduler.h"

WaterPumpScheduler::WaterPumpScheduler(IWaterPump* waterPump, unsigned long forceStopIntervalMs) {
}

WaterPumpScheduler::~WaterPumpScheduler() {
  delete _waterPump;
}

void WaterPumpScheduler::setup() {
  _waterPump->setup();
}

void WaterPumpScheduler::start(unsigned long runTimeMs, unsigned long currentTimeMs) {
  _stopTime = currentTimeMs + runTimeMs;
  _waterPump->start();
}

void WaterPumpScheduler::stop() {
  _waterPump->stop();
  _stopTime = 0; // a bit of paranoia :)
}

void WaterPumpScheduler::tick(unsigned long currentTimeMs) {
  if (_stopTime <= currentTimeMs) {
    stop();
    _stopTime = currentTimeMs + _forceStopIntervalMs; // force stop after X milliseconds
  }
}

WaterPumpScheduler::WaterPumpStatus WaterPumpScheduler::status() {
  return {
    _waterPump->isRunning(),
    _stopTime
  };
}