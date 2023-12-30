#include <gtest/gtest.h>

// include tests
#include "tests/WaterPumpScheduler_test.h"
#include "tests/CommandProcessor_test.h"

int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  int result = RUN_ALL_TESTS(); // Intentionally ignoring the return value
  (void)result; // Silence unused variable warning
  // Always return zero-code and allow PlatformIO to parse results
  return 0;
}