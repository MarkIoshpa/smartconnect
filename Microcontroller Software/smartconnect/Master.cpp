#include "Master.h"

Master::Master() : SwWire(MASTER_SDA, MASTER_SCL) {}

// Sets up I2C master on pins specified by MASTER_SDA and MASTER_SCL
void Master::setup() 
{
  SwWire.begin();
}

// Requests response from slave with given address
void Master::requestResponse(byte* buffer, int address) 
{
  SwWire.requestFrom(address, BUFF_SIZE);
}

// Sends request to slave with given address
// Returns error byte (0 success)
byte Master::sendRequest(byte* buffer, int address) 
{
  byte error;
  SwWire.beginTransmission(address);
  for(int i = 0; i < buffer[PACKAGE_LENGTH_OFFSET]; i++)
    SwWire.write(buffer[i]);
  error = SwWire.endTransmission();
  
  return error;
}

// Reads response sent by slave and writes it into a buffer
void Master::receiveResponse(byte* buffer)
{
  for(int i = 0; (i < BUFF_SIZE) && SwWire.available(); i++)
    buffer[i] = SwWire.read();
}
