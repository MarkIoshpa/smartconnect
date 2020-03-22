#include "Master.h"

Master::Master() : SwWire(MASTER_SDA, MASTER_SCL) {}

void Master::setup() 
{
  SwWire.begin();
}

void Master::requestResponse(byte* buffer) 
{
  SwWire.requestFrom(findNextSlaveAddress(buffer), BUFF_SIZE);
}

byte Master::sendRequest(byte* buffer) 
{
  byte error;
  int address = findNextSlaveAddress(buffer);
  SwWire.beginTransmission(address);
  for(int i = 0; i < BUFF_SIZE; i++)
    SwWire.write(buffer[i]);
  error = SwWire.endTransmission();
  
  return error;
}

void Master::receiveResponse(byte* buffer)
{
  for(int i = 0; (i < BUFF_SIZE) && SwWire.available(); i++)
    buffer[i] = SwWire.read();
}

int Master::findNextSlaveAddress(byte* buffer)
{
  int i;
  for(i = 0; BoardConfiguration.getId() != buffer[ADDRESS_OFFSET + i] && i < buffer[ADDRESS_LENGTH_OFFSET]; i++);
  return buffer[ADDRESS_OFFSET+i+1];
}