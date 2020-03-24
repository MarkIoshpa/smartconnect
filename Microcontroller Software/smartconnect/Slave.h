#ifndef Slave_h
#define Slave_h

#include <Arduino.h>
#include <Wire2.h>
#include "Configuration.h"
#include "Master.h"

// Response Protocol Definitions

#define COMPLETECODE_OFFSET 1  // Specifies completion code
#define DATA_LENGTH_OFFSET  2  // Specifies length of data sent in response
#define DATA_OFFSET         3  // Start of data sequence

class Slave
{
public:
  Slave();
  void setup(void (*receive)(int), void (*request)(void));
  void receiveRequest(byte* buffer);
  void sendResponse(byte* buffer);
};

#endif // Slave_h
