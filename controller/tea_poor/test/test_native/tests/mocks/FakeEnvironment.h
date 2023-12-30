#ifndef FAKE_ENVIRONMENT_H
#define FAKE_ENVIRONMENT_H

#include <IEnvironment.h>

class FakeEnvironment : public IEnvironment {
public:
  unsigned long time() const override {
    return _time;
  }
  
  void time(unsigned long time) {
    _time = time;
  }
private:
  unsigned long _time = 0;
};

#endif