// CommandProcessor class definition
#ifndef COMMANDPROCESSOR_H
#define COMMANDPROCESSOR_H

#include <string>
#include <IWaterPumpSchedulerAPI.h>
#include <IEnvironment.h>

// This class is used to process incoming commands
class CommandProcessor {
  public:
    CommandProcessor(
      int waterPumpSafeThreshold,
      const IEnvironmentPtr env,
      const IWaterPumpSchedulerAPIPtr waterPump
    ) : 
      _waterPumpSafeThreshold(waterPumpSafeThreshold),
      _env(env),
      _waterPump(waterPump)
    {}

    std::string status();
    std::string pour_tea(const char *milliseconds, const char *power);
    std::string stop();
  private:
    const int _waterPumpSafeThreshold;
    const IEnvironmentPtr _env;
    const IWaterPumpSchedulerAPIPtr _waterPump;
};
#endif // COMMANDPROCESSOR_H