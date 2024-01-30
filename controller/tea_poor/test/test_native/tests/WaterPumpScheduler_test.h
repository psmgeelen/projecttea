#include <gtest/gtest.h>
#include "mocks/FakeWaterPump.h"
#include <WaterPumpScheduler.h>

// test that pump is stopping after given time
TEST(WaterPumpScheduler, test_pump_stops_after_given_time) {
  // random time between 1 and 10 seconds
  const unsigned long runTimeMs = 1000 + (rand() % 10) * 1000;
  const auto fakeWaterPump = std::make_shared<FakeWaterPump>();
  WaterPumpScheduler waterPumpScheduler(fakeWaterPump);
  waterPumpScheduler.setup();
  // start water pump
  unsigned long currentTimeMs = 0;
  waterPumpScheduler.start(runTimeMs, 1, currentTimeMs);
  ASSERT_EQ(fakeWaterPump->powerInPercents(), 1);
  // check status
  auto status = waterPumpScheduler.status();
  ASSERT_TRUE(status.isRunning);
  ASSERT_EQ(status.stopTime, runTimeMs);

  while (currentTimeMs < runTimeMs) {
    waterPumpScheduler.tick(currentTimeMs);
    ASSERT_TRUE(fakeWaterPump->isRunning());
    currentTimeMs += 100;
  }
  // pump should be stopped after given time
  waterPumpScheduler.tick(runTimeMs + 1);
  ASSERT_FALSE(fakeWaterPump->isRunning());
}

// test that pump is periodically forced to stop after given time
TEST(WaterPumpScheduler, test_pump_is_periodically_forced_to_stop_after_given_time) {
  const auto fakeWaterPump = std::make_shared<FakeWaterPump>();
  WaterPumpScheduler waterPumpScheduler(fakeWaterPump, 1000); // force stop each 1 second
  waterPumpScheduler.setup();
  // start water pump
  unsigned long currentTimeMs = 0;
  waterPumpScheduler.start(1, 1, currentTimeMs);
  currentTimeMs += 1;
  waterPumpScheduler.tick(currentTimeMs);
  ASSERT_FALSE(fakeWaterPump->isRunning()); // pump should be stopped after given time

  for(int i = 0; i < 10; i++) {
    // emulate that pump was started again
    fakeWaterPump->start(1);
    ASSERT_EQ(fakeWaterPump->powerInPercents(), 1);
    currentTimeMs += 1000;
    waterPumpScheduler.tick(currentTimeMs);
    ASSERT_FALSE(fakeWaterPump->isRunning()); // pump should be stopped
  }
}

// test that pumps power is set to specified value
TEST(WaterPumpScheduler, test_pumps_power_is_set_to_specified_value) {
  const auto fakeWaterPump = std::make_shared<FakeWaterPump>();
  WaterPumpScheduler waterPumpScheduler(fakeWaterPump);
  waterPumpScheduler.setup();
  const int power = 23;
  waterPumpScheduler.start(1, power, 0);
  ASSERT_EQ(fakeWaterPump->powerInPercents(), power);
}