#include "Slave.h"

Slave::Slave() {}

void Slave::setup(void (*receive)(int), void (*request)(void))
{
  Wire.begin(BoardConfiguration.getId());
  Wire.onReceive(receive);
  Wire.onRequest(request);
}

void Slave::receiveRequest(byte* buffer)
{
  for(int i = 0; (i < BUFF_SIZE) && Wire.available(); i++)
    buffer[i] = Wire.read();
}

void Slave::sendResponse(byte* buffer)
{
  for(int i = 0; (i < BUFF_SIZE); i++)
    Wire.write(buffer[i]);
}