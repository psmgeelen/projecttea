#include "WaterPumpScheduler.h"

WaterPumpScheduler::WaterPumpScheduler(IWaterPump* waterPump, unsigned long forceStopIntervalMs) :
  _waterPump(waterPump),
  _forceStopIntervalMs(forceStopIntervalMs)
{
}

WaterPumpScheduler::~WaterPumpScheduler() {
  // TODO: find better way to manage memory
  //       for now it's not a big deal, because Arduino will never stop
  //       and tests are manage memory by themselves
  // delete _waterPump;
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