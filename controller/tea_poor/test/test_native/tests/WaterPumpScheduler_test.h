#include <gtest/gtest.h>
#include "mocks/FakeWaterPump.h"
#include "mocks/FakeEnvironment.h"
#include <WaterPumpScheduler.h>

// test that pump is stopping after given time
TEST(WaterPumpScheduler, test_pump_stops_after_given_time) {
  // random time between 1 and 10 seconds
  const unsigned long runTimeMs = 1000 + (rand() % 10) * 1000;
  const auto fakeEnvironment = std::make_shared<FakeEnvironment>();
  const auto fakeWaterPump = std::make_shared<FakeWaterPump>();
  WaterPumpScheduler waterPumpScheduler(fakeWaterPump, fakeEnvironment);
  waterPumpScheduler.setup();
  // start water pump
  fakeEnvironment->time(0);
  waterPumpScheduler.start(runTimeMs, 1);
  ASSERT_EQ(fakeWaterPump->power(), 1);
  // check status
  auto status = waterPumpScheduler.status();
  ASSERT_TRUE(status.isRunning);
  ASSERT_EQ(status.stopTime, runTimeMs);

  while (fakeEnvironment->time() < runTimeMs) {
    waterPumpScheduler.tick();
    ASSERT_TRUE(fakeWaterPump->isRunning());
    fakeEnvironment->time(fakeEnvironment->time() + 100);
  }
  // pump should be stopped after given time
  fakeEnvironment->time(runTimeMs + 1);
  waterPumpScheduler.tick();
  ASSERT_FALSE(fakeWaterPump->isRunning());
}

// test that pump is periodically forced to stop after given time
TEST(WaterPumpScheduler, test_pump_is_periodically_forced_to_stop_after_given_time) {
  const auto fakeWaterPump = std::make_shared<FakeWaterPump>();
  const auto fakeEnvironment = std::make_shared<FakeEnvironment>();
  const int T = 1000; // 1 second
  WaterPumpScheduler waterPumpScheduler(fakeWaterPump, fakeEnvironment, T); // force stop each T
  waterPumpScheduler.setup();
  // start water pump
  fakeEnvironment->time(0);
  waterPumpScheduler.start(1, 1);
  fakeEnvironment->time(1);
  waterPumpScheduler.tick();
  ASSERT_FALSE(fakeWaterPump->isRunning()); // pump should be stopped after given time

  for(int i = 0; i < 10; i++) {
    // emulate that pump was started again
    fakeWaterPump->start(1);
    ASSERT_EQ(fakeWaterPump->power(), 1);
    fakeEnvironment->time(fakeEnvironment->time() + T);
    waterPumpScheduler.tick();
    ASSERT_FALSE(fakeWaterPump->isRunning()); // pump should be stopped
  }
}

// test that pumps power is set to specified value
TEST(WaterPumpScheduler, test_pumps_power_is_set_to_specified_value) {
  const auto fakeWaterPump = std::make_shared<FakeWaterPump>();
  const auto fakeEnvironment = std::make_shared<FakeEnvironment>();
  WaterPumpScheduler waterPumpScheduler(fakeWaterPump, fakeEnvironment);
  waterPumpScheduler.setup();
  const int power = 23;
  waterPumpScheduler.start(1, power);
  ASSERT_EQ(fakeWaterPump->power(), power);
}