#ifndef IENVIRONMENT_H
#define IENVIRONMENT_H

#include <memory>

class IEnvironment {
  public:
    virtual unsigned long time() const = 0;
    virtual ~IEnvironment() {}
};

typedef std::shared_ptr<IEnvironment> IEnvironmentPtr;
#endif // IENVIRONMENT_H