#ifndef Slave_h
#define Slave_h

#include <Wire2.h>
#include "Configuration.h"
#include "Master.h"

// Protocol Definitions

#define COMPLETECODE_OFFSET 1
#define DATA_LENGTH_OFFSET 2
#define DATA_OFFSET 3

class Slave
{
public:
  Slave();
  void setup(void (*receive)(int), void (*request)(void));
  void receiveRequest(uint8_t* buffer);
  void sendResponse(uint8_t* buffer);
};

#endif // Slave_h

