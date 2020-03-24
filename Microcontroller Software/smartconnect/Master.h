#ifndef Master_h
#define Master_h

#include <Arduino.h>
#include <SoftwareWire.h>
#include "Configuration.h"

// Master I2C pin definitions

#define MASTER_SDA 16
#define MASTER_SCL 17

// Request Protocol Definitions

#define BUFF_SIZE             127 // Size of buffer used for sending messages between master and slave
#define PACKAGE_LENGTH_OFFSET 0   // Specifies package length
#define OPCODE_OFFSET         1   // Specifies which operation will be executed
#define ADDRESS_LENGTH_OFFSET 2   // Specifies the total length of addresses in path to the specific microcontroller
#define ADDRESS_OFFSET        3   // Specifies the start of address sequence that represent the path to a microcontroller

class Master
{
public:
  Master();
  void setup();
  void requestResponse(byte* buffer, int address);
  byte sendRequest(byte* buffer, int address);
  void receiveResponse(byte* buffer);

private:
  SoftwareWire SwWire;  // SoftwareWire used to create I2C protocol using any of the pins
};

#endif // Master_h
