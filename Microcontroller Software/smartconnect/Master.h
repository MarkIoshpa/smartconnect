#ifndef Master_h
#define Master_h

#include <SoftwareWire.h>
#include "Configuration.h"

// Master I2C pin definitions

#define MASTER_SDA 16
#define MASTER_SCL 17

// Protocol Definitions

#define BUFF_SIZE 127 // size of buffer used for sending messages between master and slave
#define PACKAGE_LENGTH_OFFSET 0
#define OPCODE_OFFSET 1
#define ADDRESS_LENGTH_OFFSET 2
#define ADDRESS_OFFSET 3

class Master
{
public:
  Master();
  void setup();
  void requestResponse(uint8_t* buffer);
  byte sendRequest(uint8_t* buffer);
  void receiveResponse(uint8_t* buffer);

private:
  SoftwareWire SwWire;

  int findNextSlaveAddress(uint8_t* buffer);
};

#endif // Master_h

