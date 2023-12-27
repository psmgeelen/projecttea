#ifndef WATERPUMPCONTROLLER_H
#define WATERPUMPCONTROLLER_H

class WaterPumpController {
public:
  enum EPumpState {
    PUMP_OFF,
    PUMP_ON
  };
private:
  const int _directionPin;
  const int _brakePin;
  const int _powerPin;
  const int _maxPower = 255;
  EPumpState _state = PUMP_OFF;
public:
  WaterPumpController(int directionPin, int brakePin, int powerPin);
  ~WaterPumpController();

  void setup();
  void pour(int miliseconds);
  void startPump();
  void stopPump();

  EPumpState state() const { return _state; }
};

#endif // WATERPUMPCONTROLLER_H
