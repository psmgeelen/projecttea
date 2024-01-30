#include "WaterPumpScheduler.h"

WaterPumpScheduler::WaterPumpScheduler(IWaterPumpPtr waterPump, IEnvironmentPtr env, unsigned long forceStopIntervalMs) :
  _waterPump(waterPump),
  _env(env),
  _forceStopIntervalMs(forceStopIntervalMs)
{
}

WaterPumpScheduler::~WaterPumpScheduler() {}

void WaterPumpScheduler::setup() {
  _waterPump->setup();
}

void WaterPumpScheduler::start(unsigned long runTimeMs, int power) {
  _stopTime = _env->time() + runTimeMs;
  _waterPump->start(power);
}

void WaterPumpScheduler::stop() {
  _waterPump->stop();
  _stopTime = 0; // a bit of paranoia :)
}

void WaterPumpScheduler::tick() {
  const auto currentTimeMs = _env->time();
  if (_stopTime <= currentTimeMs) {
    stop();
    _stopTime = currentTimeMs + _forceStopIntervalMs; // force stop after X milliseconds
  }
}

WaterPumpStatus WaterPumpScheduler::status() {
  return WaterPumpStatus(_waterPump->isRunning(), _stopTime);
}