#include <gtest/gtest.h>
#include "mocks/FakeWaterPump.h"
#include <AdjustedWaterPump.h>

// test that pumps power passed as percents is converted to 0..255 range
TEST(AdjustedWaterPump, test_pumps_power_passed_as_percents_is_converted_to_0_255_range) {
  const auto fakeWaterPump = std::make_shared<FakeWaterPump>();
  AdjustedWaterPump adjustedWaterPump(fakeWaterPump);  
  // list of pairs: (powerInPercents, expectedPower)
  const std::vector<std::pair<int, int>> tests = {
    {0, 0}, {1, 2}, {2, 5},
    {50, 127}, {100, 255}
  };
  for(const auto& test: tests) {
    adjustedWaterPump.start(test.first);
    ASSERT_EQ(fakeWaterPump->power(), test.second);
  }
}