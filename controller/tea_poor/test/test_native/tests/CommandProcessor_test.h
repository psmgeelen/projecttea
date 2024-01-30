#include <gtest/gtest.h>
#include <CommandProcessor.h>
#include "mocks/FakeWaterPumpSchedulerAPI.h"
#include "mocks/FakeEnvironment.h"

const auto VALID_POWER = "100";
const auto INVALID_TIME_ERROR_MESSAGE = "{ \"error\": \"invalid milliseconds value\" }";
// test that pour_tea() method returns error message if milliseconds:
// - greater than threshold
// - less than 0
// - empty string
// - not a number
TEST(CommandProcessor, pour_tea_invalid_milliseconds) {
  CommandProcessor commandProcessor(123, nullptr, nullptr);
  ASSERT_EQ(commandProcessor.pour_tea("1234", VALID_POWER), INVALID_TIME_ERROR_MESSAGE);
  ASSERT_EQ(commandProcessor.pour_tea("-1", VALID_POWER), INVALID_TIME_ERROR_MESSAGE);
  ASSERT_EQ(commandProcessor.pour_tea("", VALID_POWER), INVALID_TIME_ERROR_MESSAGE);
  ASSERT_EQ(commandProcessor.pour_tea("abc", VALID_POWER), INVALID_TIME_ERROR_MESSAGE);
}

// for simplicity of the UI, we should accept as valid 0 and exactly threshold value
TEST(CommandProcessor, pour_tea_valid_boundary_values) {
  auto env = std::make_shared<FakeEnvironment>();
  auto waterPump = std::make_shared<FakeWaterPumpSchedulerAPI>();
  CommandProcessor commandProcessor(123, env, waterPump);
  
  ASSERT_NE(commandProcessor.pour_tea("0", VALID_POWER), INVALID_TIME_ERROR_MESSAGE);
  ASSERT_NE(commandProcessor.pour_tea("123", VALID_POWER), INVALID_TIME_ERROR_MESSAGE);
}

// test that start pouring tea by calling pour_tea() method and its stops after T milliseconds
TEST(CommandProcessor, pour_tea) {
  auto env = std::make_shared<FakeEnvironment>();
  env->time(2343);
  auto waterPump = std::make_shared<FakeWaterPumpSchedulerAPI>();
  CommandProcessor commandProcessor(10000, env, waterPump);
  const auto response = commandProcessor.pour_tea("1234", "23");
  ASSERT_EQ(waterPump->_log, "start(1234, 23, 2343)\n");
}

// test that stop() method stops pouring tea
TEST(CommandProcessor, stop) {
  auto env = std::make_shared<FakeEnvironment>();
  auto waterPump = std::make_shared<FakeWaterPumpSchedulerAPI>();
  CommandProcessor commandProcessor(123, env, waterPump);
  const auto response = commandProcessor.stop();
  ASSERT_EQ(waterPump->_log, "stop()\n");
}

// test that status() method returns JSON string with water pump status
TEST(CommandProcessor, status) {
  auto env = std::make_shared<FakeEnvironment>();
  auto waterPump = std::make_shared<FakeWaterPumpSchedulerAPI>();
  CommandProcessor commandProcessor(123, env, waterPump);
  const auto response = commandProcessor.status();
  ASSERT_EQ(response, "{"
    "\"time\": 0, "
    "\"water threshold\": 123, "
    "\"pump\": {"
    "  \"running\": false, "
    "  \"time left\": 0"
    "}"
    "}"
  );
}

// test that status() method returns JSON string with actual time left
TEST(CommandProcessor, status_running) {
  auto env = std::make_shared<FakeEnvironment>();
  auto waterPump = std::make_shared<FakeWaterPumpSchedulerAPI>();
  CommandProcessor commandProcessor(12345, env, waterPump);
  
  commandProcessor.pour_tea("1123", "100");

  env->time(123);
  waterPump->_status.isRunning = true;
  waterPump->_status.stopTime = 1123;
  
  const auto response = commandProcessor.status();
  ASSERT_EQ(response, "{"
    "\"time\": 123, "
    "\"water threshold\": 12345, "
    "\"pump\": {"
    "  \"running\": true, "
    "  \"time left\": 1000"
    "}"
    "}"
  );
}