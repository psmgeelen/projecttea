// I wasn't able to run tests at all. Run them locally and confirm that they are working.
// Its either a local problem or a problem with the configuration of the project.
// Further goes a sketch of the tests, but I wasn't able to run them.
#include <unity.h>
#include <WaterPumpScheduler.h>



// Fake water pump
class FakeWaterPump : public IWaterPump {
private:
  bool _isRunning = false;
public:
  void setup() override { _isRunning = false; }
  void start() override { _isRunning = true;  }
  void stop() override  { _isRunning = false; }

  bool isRunning() const override { return _isRunning; }
};
// End of fake water pump


/* Empty functions required by unity framework*/
void setUp() { /* Setup code here */ }
void tearDown() { /* Teardown code here */ }


// test that pump is stopping after given time
void test_pump_stops_after_given_time() {
  // random time between 1 and 10 seconds
  const unsigned long runTimeMs = 1000 + (rand() % 10) * 1000;
  FakeWaterPump fakeWaterPump;
  WaterPumpScheduler waterPumpScheduler(&fakeWaterPump);
  waterPumpScheduler.setup();
  // start water pump
  unsigned long currentTimeMs = 0;
  waterPumpScheduler.start(runTimeMs, currentTimeMs);
  // check status
  auto status = waterPumpScheduler.status();
  UNITY_TEST_ASSERT_TRUE(status.isRunning);
  UNITY_TEST_ASSERT_EQUAL(status.stopTime, runTimeMs);

  while (currentTimeMs < runTimeMs) {
    waterPumpScheduler.tick(currentTimeMs);
    UNITY_TEST_ASSERT_TRUE(fakeWaterPump.isRunning());
    currentTimeMs += 100;
  }
  // pump should be stopped after given time
  waterPumpScheduler.tick(runTimeMs + 1);
  UNITY_TEST_ASSERT_FALSE(fakeWaterPump.isRunning());
}

// test that pump is periodically forced to stop after given time
void test_pump_is_periodically_forced_to_stop_after_given_time () {
  FakeWaterPump fakeWaterPump;
  WaterPumpScheduler waterPumpScheduler(&fakeWaterPump, 1000); // force stop each 1 second
  waterPumpScheduler.setup();
  // start water pump
  unsigned long currentTimeMs = 0;
  waterPumpScheduler.start(1, currentTimeMs);
  currentTimeMs += 1;
  waterPumpScheduler.tick(currentTimeMs);
  UNITY_TEST_ASSERT_FALSE(fakeWaterPump.isRunning()); // pump should be stopped after given time

  for(int i = 0; i < 10; i++) {
    // emulate that pump was started again
    fakeWaterPump.start();
    currentTimeMs += 1000;
    waterPumpScheduler.tick(currentTimeMs);
    UNITY_TEST_ASSERT_FALSE(fakeWaterPump.isRunning()); // pump should be stopped
  }
}

void setup() {
  UNITY_BEGIN();
  RUN_TEST(test_pump_stops_after_given_time);
  RUN_TEST(test_pump_is_periodically_forced_to_stop_after_given_time);
  UNITY_END();
}


void loop() {

}