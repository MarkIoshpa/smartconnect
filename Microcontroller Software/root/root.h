#ifndef Root_h
#define Root_h

#include <Arduino.h>
#include <HardwareSerial.h>
#include "Master.h"
#include "Slave.h"

class Root
{
public:
  void sendWorkstationResponse(byte* buffer);
  bool receiveWorkstationRequest(byte* buffer);
};

#endif // Root_h
