#include "Slave.h"

Slave::Slave() {}

// Sets up I2C slave with ID from configuration data, and sets up receive and request events
void Slave::setup(void (*receive)(int), void (*request)(void))
{
  Wire.begin(BoardConfiguration.getId());
  Wire.onReceive(receive);
  Wire.onRequest(request);
}

// Reads message received from master and writes it into a buffer
void Slave::receiveRequest(byte* buffer)
{
  for(uint8_t i = 0; (i < BUFF_SIZE) && Wire.available(); i++)
    buffer[i] = Wire.read();
}

// Writes message that is sent back to master from buffer
void Slave::sendResponse(byte* buffer)
{
  for(uint8_t i = 0; (i < buffer[PACKAGE_LENGTH_OFFSET]); i++)
    Wire.write(buffer[i]);
}
